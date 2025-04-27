package ru.sberhack2025.companyevents.procurement.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import ru.sberhack2025.companyevents.core.mapper.DefaultMapper;
import ru.sberhack2025.companyevents.procurement.dto.ContributionView;
import ru.sberhack2025.companyevents.procurement.dto.ProcurementCreateDto;
import ru.sberhack2025.companyevents.procurement.dto.ProcurementUpdateDto;
import ru.sberhack2025.companyevents.procurement.dto.ProcurementView;
import ru.sberhack2025.companyevents.procurement.model.Procurement;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

/**
 * @author Andrey Kurnosov
 */
@Mapper(componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ProcurementMapper extends DefaultMapper<Procurement, ProcurementCreateDto, ProcurementUpdateDto, ProcurementView> {

    @Mapping(target = "contributors", ignore = true)
    @Mapping(target = "completionStatus", defaultExpression = "java(Procurement.CompletionStatus.IN_PROGRESS)")
    @Mapping(target = "fundraisingStatus", defaultExpression = "java(Procurement.FundraisingStatus.NONE)")
    Procurement fromDto(ProcurementCreateDto createDto);

    @Mapping(target = "contributors", ignore = true)
    ProcurementView toView(Procurement procurement);

    @Mapping(target = "contributors", ignore = true)
    Procurement update(ProcurementUpdateDto updateDto, @MappingTarget Procurement entity);

    default List<ContributionView> toContributionView(List<Procurement> procurements, Integer participationsNumber) {
        return procurements.stream()
            .map(p -> toContributionView(p, participationsNumber))
            .sorted(Comparator.comparing(ContributionView::getCreatedAt).reversed())
            .toList();
    }

    default ContributionView toContributionView(Procurement procurement, Integer participationsNumber) {
        BigDecimal contributors = BigDecimal.valueOf(procurement.getContributors().size());
        BigDecimal participations = BigDecimal.valueOf(participationsNumber);
        return ContributionView.builder()
            .id(procurement.getId())
            .name(procurement.getName())
            .comment(procurement.getComment())
            .price(getPrice(procurement, contributors, participations))
            .createdAt(procurement.getCreatedAt())
            .build();
    }

    private BigDecimal getPrice(Procurement procurement, BigDecimal contributors, BigDecimal participations) {
        BigDecimal price = Optional.ofNullable(procurement.getPrice()).orElse(BigDecimal.ZERO);
        if (procurement.getContributors().isEmpty()) {
            return price.divide(participations, RoundingMode.UP);
        } else {
            return price.divide(contributors, RoundingMode.UP);
        }
    }

    default String toCompareTelegramMessage(Procurement oldProcurement, Procurement newProcurement) {
        return String.join("\n",
            String.format("Закупка «%s» под твоей ответственностью, была изменена.\n", oldProcurement.getName()),
            "Было:",
            toTelegramMessage(oldProcurement, newProcurement),
            "\nСтало:",
            toTelegramMessage(newProcurement, oldProcurement)
        );
    }

    default String toTelegramMessage(Procurement view, Procurement other) {
        List<String> message = new ArrayList<>();

        if (!view.getName().equals(other.getName())) {
            message.add(formatField("- Название", view.getName()));
        }

        if (view.getPrice().compareTo(other.getPrice()) != 0) {
            message.add(formatField("- Цена", view.getPrice().toPlainString()));
        }

        if (!view.getComment().equals(other.getComment())) {
            message.add(formatField("- Комментарий", view.getComment()));
        }

        if (!view.getCompletionStatus().equals(other.getCompletionStatus())) {
            message.add(formatField("- Статус выполнения", view.getCompletionStatus().getDisplayName()));
        }

        if (!view.getFundraisingStatus().equals(other.getFundraisingStatus())) {
            message.add(formatField("- Статус сбора средств", view.getFundraisingStatus().getDisplayName()));
        }

        return String.join("\n", message);
    }

    private String formatField(String label, String value) {
        return label + ": " + (value != null ? value : "<не заполнено>");
    }

}
