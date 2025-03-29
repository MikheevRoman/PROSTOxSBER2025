package ru.sberhack2025.telegrambot.services.procurements;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProcurementsResponseDto {

    private UUID id;

    private String name;

    private Long price;

    private String comment;

    private CompletionStatus completionStatus;

    private List<UUID> contributors;

    private FundraisingStatus fundraisingStatus;

}
