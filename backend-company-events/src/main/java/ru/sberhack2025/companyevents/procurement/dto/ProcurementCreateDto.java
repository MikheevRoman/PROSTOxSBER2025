package ru.sberhack2025.companyevents.procurement.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import ru.sberhack2025.companyevents.procurement.model.Procurement;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProcurementCreateDto {


    @Schema(description = "Procurement's name", example = "Masha")
    @NotNull(message = "Field \"name\" cannot be null")
    String name;

    @Schema(description = "Procurement's price", example = "600")
    @Min(value = 0, message = "Price cannot be negative")
    @Digits(integer = 10, fraction = 2, message = "Price must be up to 10 digits in integral part and 2 in fraction")
    BigDecimal price;

    @Schema(description = "Procurement's comment", example = "funny comment")
    String comment;

    @Schema(description = "Responsible participant id (uuid)", example = "faf063f0-50d9-4251-89dd-be1487f73b9c")
    @NotNull(message = "Field \"responsibleId\" cannot be null")
    UUID responsibleId;

    @Schema(description = "Status of procurement task")
    Procurement.CompletionStatus completionStatus;


    @Schema(description = "List of participants ids who will pay for this procurement")
    List<UUID> contributors;

    @Schema(description = "Status of procurement task")
    Procurement.FundraisingStatus fundraisingStatus;

    @Schema(hidden = true)
    UUID eventId;
}
