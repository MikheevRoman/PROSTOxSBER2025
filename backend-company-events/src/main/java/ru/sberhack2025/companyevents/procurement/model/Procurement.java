package ru.sberhack2025.companyevents.procurement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jdk.jfr.Unsigned;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import ru.sberhack2025.companyevents.core.model.BaseEntity;
import ru.sberhack2025.companyevents.event.model.Event;
import ru.sberhack2025.companyevents.participant.model.Participant;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Andrey Kurnosov
 */
@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "procurement")
@ToString(exclude = {"event", "responsible", "contributors"})
@EqualsAndHashCode(callSuper = true, exclude = {"event", "responsible", "contributors"})
public class Procurement extends BaseEntity {

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    Event event;

    @Column(nullable = false)
    String name;

    @Column(precision = 10, scale = 2)
    @Unsigned
    BigDecimal price;

    @Column
    String comment;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "responsible_id", nullable = false)
    Participant responsible;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    CompletionStatus completionStatus = CompletionStatus.IN_PROGRESS;

    @Builder.Default
    @ManyToMany
    @JoinTable(
            name = "procurement_contributors",
            joinColumns = @JoinColumn(name = "procurement_id"),
            inverseJoinColumns = @JoinColumn(name = "participant_id")
    )
    private List<Participant> contributors = new ArrayList<>();

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FundraisingStatus fundraisingStatus = FundraisingStatus.NONE;

    public enum CompletionStatus {
        IN_PROGRESS,
        DONE
    }

    public enum FundraisingStatus {
        NONE,      // сбор средств не производится
        PLANNING,  // планируется сбор средств
        DONE       // сбор средств завершён
    }

    public void addContributor(Participant participant) {
        contributors.add(participant);
        participant.getContributedProcurements().add(this);
    }

    public void removeContributor(Participant participant) {
        contributors.remove(participant);
        participant.getContributedProcurements().remove(this);
    }

}


