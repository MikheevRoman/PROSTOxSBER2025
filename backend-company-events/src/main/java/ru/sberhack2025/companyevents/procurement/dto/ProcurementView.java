package ru.sberhack2025.companyevents.procurement.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import ru.sberhack2025.companyevents.common.formatter.DateFormatter;
import ru.sberhack2025.companyevents.core.dto.BaseView;
import ru.sberhack2025.companyevents.procurement.model.Procurement;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProcurementView extends BaseView implements DateFormatter {

    @Schema(description = "Procurement id (uuid)", example = "faf063f0-50d9-4251-89dd-be1487f73b9c")
    UUID id;

    @Schema(description = "Procurement name", example = "Grecha")
    String name;

    @Schema(description = "Procurement's price", example = "600")
    BigDecimal price;

    @Schema(description = "Procurement's comment", example = "funny comment")
    String comment;

    @Schema(description = "Responsible participant id (uuid)", example = "faf063f0-50d9-4251-89dd-be1487f73b9c")
    @NotNull(message = "Field \"responsibleId\" cannot be null")
    UUID responsibleId;

    @Schema(description = "Completion status of procurement task")
    @NotNull(message = "Field \"completionStatus\" cannot be null")
    Procurement.CompletionStatus completionStatus;

    @Schema(description = "List of participants ids who will pay for this procurement")
    List<UUID> contributors;

    @Schema(description = "Fundraising status of procurement task")
    @NotNull(message = "Field \"fundraisingStatus\" cannot be null")
    Procurement.FundraisingStatus fundraisingStatus;
}
