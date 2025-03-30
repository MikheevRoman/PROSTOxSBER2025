package ru.sberhack2025.companyevents.costresult.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CostResultView {

    @Schema(description = "Participant id (uuid)", example = "faf063f0-50d9-4251-89dd-be1487f73b9c")
    UUID participantId;

    @Schema(description = "Participant's name", example = "Маша")
    String name;

    @Schema(description = "Participant's spent money", example = "300")
    BigDecimal spentAmount;

    @Schema(description = "Participant's owed money", example = "600")
    BigDecimal owedAmount;

    @Schema(description = "Participant's amount for transfer", example = "-300")
    BigDecimal totalAmount;

    @Schema(description = "Text for reminder message", example = "Маша, переведи мне 300 руб. Данные перевода: +7 (999) 999-99-99, сбер")
    String notificationMessage;

    @Schema(description = "True if organizer transfer money to participant", example = "true")
    Boolean hasPayment;

}
