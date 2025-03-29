package ru.sberhack2025.companyevents.procurement.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import ru.sberhack2025.companyevents.core.mapper.DefaultMapper;
import ru.sberhack2025.companyevents.procurement.dto.ContributionView;
import ru.sberhack2025.companyevents.procurement.dto.ProcurementCreateDto;
import ru.sberhack2025.companyevents.procurement.dto.ProcurementUpdateDto;
import ru.sberhack2025.companyevents.procurement.dto.ProcurementView;
import ru.sberhack2025.companyevents.procurement.model.Procurement;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

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

    default List<ContributionView> toContributionView(List<Procurement> procurements, Integer participationsNumber) {
        return procurements.stream().map(p -> toContributionView(p, participationsNumber)).toList();
    }

    default ContributionView toContributionView(Procurement procurement, Integer participationsNumber) {
        BigDecimal contributors = BigDecimal.valueOf(procurement.getContributors().size());
        BigDecimal participations = BigDecimal.valueOf(participationsNumber);
        return ContributionView.builder()
                .id(procurement.getId())
                .name(procurement.getName())
                .comment(procurement.getComment())
                .price(getPrice(procurement, contributors, participations))
                .build();
    }

    private BigDecimal getPrice(Procurement procurement, BigDecimal contributors, BigDecimal participations) {
        if (procurement.getContributors().isEmpty()) {
            return procurement.getPrice().divide(participations, RoundingMode.UP);
        } else {
            return procurement.getPrice().divide(contributors, RoundingMode.UP);
        }
    }

}
