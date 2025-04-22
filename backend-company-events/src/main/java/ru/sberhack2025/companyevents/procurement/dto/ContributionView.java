package ru.sberhack2025.companyevents.procurement.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import ru.sberhack2025.companyevents.core.dto.BaseView;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ContributionView extends BaseView {

    @Schema(description = "Procurement id (uuid)", example = "faf063f0-50d9-4251-89dd-be1487f73b9c")
    UUID id;

    @Schema(description = "Procurement name", example = "Grecha")
    String name;

    @Schema(description = "Participant's contribution for this procurement", example = "600")
    BigDecimal price;

    @Schema(description = "Procurement's comment", example = "funny comment")
    String comment;
}
