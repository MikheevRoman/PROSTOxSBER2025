package ru.sberhack2025.companyevents.procurement.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.sberhack2025.companyevents.core.service.DefaultServiceImpl;
import ru.sberhack2025.companyevents.event.model.Event;
import ru.sberhack2025.companyevents.event.repository.EventRepository;
import ru.sberhack2025.companyevents.notification.dto.NotificationDto;
import ru.sberhack2025.companyevents.notification.service.NotificationServiceImpl;
import ru.sberhack2025.companyevents.participant.model.Participant;
import ru.sberhack2025.companyevents.participant.repository.ParticipantRepository;
import ru.sberhack2025.companyevents.procurement.dto.ContributionView;
import ru.sberhack2025.companyevents.procurement.dto.ProcurementCreateDto;
import ru.sberhack2025.companyevents.procurement.dto.ProcurementUpdateDto;
import ru.sberhack2025.companyevents.procurement.dto.ProcurementView;
import ru.sberhack2025.companyevents.procurement.mapper.ProcurementMapper;
import ru.sberhack2025.companyevents.procurement.model.Procurement;
import ru.sberhack2025.companyevents.procurement.repository.ProcurementRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
@Service
@Slf4j
public class ProcurementServiceImpl extends DefaultServiceImpl<
    Procurement,
    ProcurementCreateDto,
    ProcurementUpdateDto,
    ProcurementView,
    ProcurementRepository,
    ProcurementMapper> implements ProcurementService {

    private final ParticipantRepository participantRepository;
    private final EventRepository eventRepository;
    private final NotificationServiceImpl notificationService;

    public ProcurementServiceImpl(
        @Qualifier("procurementRepository") ProcurementRepository procurementRepository,
        ProcurementMapper procurementMapper,
        ParticipantRepository participantRepository,
        EventRepository eventRepository,
        NotificationServiceImpl notificationService) {
        super(procurementRepository, procurementMapper);
        this.participantRepository = participantRepository;
        this.eventRepository = eventRepository;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public ProcurementView update(UUID id, ProcurementUpdateDto updateDto) {
        Procurement oldProcurement = repository.find(id);
        Procurement newProcurement = mapper.update(updateDto, oldProcurement.toBuilder().build());

        UUID oldResponsibleId = oldProcurement.getResponsible().getId();
        UUID newResponsibleId = updateDto.getResponsibleId();

        // обновляем контрибьютеров
        if (updateDto.getContributors() != null) {
            // список удаленных контрибьютеров
            List<Participant> newContributors = participantRepository.findAllById(updateDto.getContributors());
            List<Participant> removedContributors = new ArrayList<>(oldProcurement.getContributors());
            removedContributors.removeAll(newContributors);
            for (Participant participant : removedContributors) {
                newProcurement.removeContributor(participant);
            }

            // список добавленных контрибьютеров
            List<Participant> addedContributors = new ArrayList<>(newContributors);
            addedContributors.removeAll(oldProcurement.getContributors());
            for (Participant participant : addedContributors) {
                newProcurement.addContributor(participant);
            }
        }

        // обновляем ответственного
        if (updateDto.getResponsibleId() != null && !updateDto.getResponsibleId().equals(oldResponsibleId)) {
            Participant newResponsible = participantRepository.find(updateDto.getResponsibleId());
            newProcurement.setResponsible(newResponsible);

            // отправляем уведомление новому ответственному (если сменил не он)
            if (!updateDto.getActionParticipant().equals(newResponsibleId)) {
                String assignMessage = String.format("На вас назначили закупку: «%s», цена: %s ₽", oldProcurement.getName(), oldProcurement.getPrice().toString());
                NotificationDto assignNotification = NotificationDto.builder()
                    .messageText(assignMessage)
                    .build();
                notificationService.sendNotificationToParticipant(newResponsibleId, assignNotification);
            }

            // отправляем уведомление старому ответственному (если сменил не он)
            if (!updateDto.getActionParticipant().equals(oldResponsibleId)) {
                String unassignMessage = String.format("С вас сняли закупку: «%s»", oldProcurement.getName());
                NotificationDto unassignNotification = NotificationDto.builder()
                    .messageText(unassignMessage)
                    .build();
                notificationService.sendNotificationToParticipant(oldResponsibleId, unassignNotification);
            }
        }

        //  если кто-то поменял основные реквизиты закупки, то ответственного за нее уведомляем (если не сменился ответственный и если сменил не сам ответственный)
        if ((updateDto.getResponsibleId() == null || updateDto.getResponsibleId().equals(oldResponsibleId)) &&
            !updateDto.getActionParticipant().equals(oldResponsibleId) &&
            !newProcurement.equals(oldProcurement)) {
            NotificationDto notification = NotificationDto.builder()
                .messageText(mapper.toCompareTelegramMessage(oldProcurement, newProcurement))
                .build();
            notificationService.sendNotificationToParticipant(newProcurement.getResponsible().getId(), notification);
        }

        repository.save(newProcurement);
        return toView(newProcurement);

    }

    @Override
    @Transactional
    public List<ProcurementView> createAndGetAll(ProcurementCreateDto createDto) {
        this.create(createDto);
        return this.getAllByEvent(createDto.getEventId());
    }

    @Override
    @Transactional
    public List<ProcurementView> updateAndGetAll(UUID entityId, ProcurementUpdateDto updateDto) {
        this.update(entityId, updateDto);
        return this.getAllByEvent(updateDto.getEventId());
    }

    @Override
    @Transactional
    public List<ProcurementView> deleteAndGetAll(UUID entityId, UUID eventId) {
        this.delete(entityId);
        return this.getAllByEvent(eventId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProcurementView> getAllByEvent(UUID eventId) {
        Event event = eventRepository.find(eventId);
        List<Procurement> procurements = repository.findAllByEvent(event);
        return toView(procurements);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProcurementView> getAllByResponsible(UUID participantId) {
        Participant participant = participantRepository.find(participantId);
        List<Procurement> procurements = repository.findAllByResponsible(participant);
        return toView(procurements);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContributionView> getAllByContributor(UUID participantId) {
        Participant participant = participantRepository.find(participantId);
        Integer participationsNumber = participant.getEvent().getParticipants().size();
        List<Procurement> procurements = repository.findProcurementsByEventAndContributor(participant.getEvent(), participant);
        return mapper.toContributionView(procurements, participationsNumber);
    }


    @Override
    @Transactional
    protected Procurement toEntity(ProcurementCreateDto createDto) {
        Event event = eventRepository.find(createDto.getEventId());
        List<UUID> contributorsIds = Optional.ofNullable(createDto.getContributors()).orElseGet(ArrayList::new);
        List<Participant> contributors = participantRepository.findAllById(contributorsIds);
        Participant responsible = participantRepository.find(createDto.getResponsibleId());
        Procurement procurement = super.toEntity(createDto);

        event.addProcurement(procurement);
        responsible.addResponsibleProcurement(procurement);
        contributors.forEach(c -> c.addContributedProcurement(procurement));
        return procurement;
    }

    @Override
    protected ProcurementView enrichView(Procurement entity, ProcurementView dto) {
        List<UUID> contributors = entity.getContributors().stream().map(Participant::getId).toList();
        UUID responsibleId = entity.getResponsible().getId();
        dto.setContributors(contributors);
        dto.setResponsibleId(responsibleId);
        return dto;
    }


}
