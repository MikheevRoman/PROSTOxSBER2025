package ru.sberhack2025.companyevents.procurement.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.sberhack2025.companyevents.core.service.DefaultServiceImpl;
import ru.sberhack2025.companyevents.event.model.Event;
import ru.sberhack2025.companyevents.event.repository.EventRepository;
import ru.sberhack2025.companyevents.participant.dto.ParticipantView;
import ru.sberhack2025.companyevents.participant.model.Participant;
import ru.sberhack2025.companyevents.participant.repository.ParticipantRepository;
import ru.sberhack2025.companyevents.participant.service.ParticipantService;
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
    private final ParticipantService participantService;
    private final EventRepository eventRepository;

    public ProcurementServiceImpl(
            @Qualifier("procurementRepository") ProcurementRepository procurementRepository,
            ProcurementMapper procurementMapper,
            ParticipantRepository participantRepository,
            ParticipantService participantService,
            EventRepository eventRepository) {
        super(procurementRepository, procurementMapper);
        this.participantRepository = participantRepository;
        this.participantService = participantService;
        this.eventRepository = eventRepository;
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
        List<Procurement> procurements = repository.findByContributorsContainingOrContributorsIsEmpty(participant);
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
        List<ParticipantView> contributors = participantService.toView(entity.getContributors());
        ParticipantView responsible = participantService.toView(entity.getResponsible());
        dto.setContributors(contributors);
        dto.setResponsible(responsible);
        return dto;
    }


}
