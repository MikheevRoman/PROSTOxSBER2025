package ru.sberhack2025.companyevents.event.model;

import jakarta.persistence.*;
import jdk.jfr.Unsigned;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import ru.sberhack2025.companyevents.core.model.BaseEntity;
import ru.sberhack2025.companyevents.participant.model.Participant;
import ru.sberhack2025.companyevents.procurement.model.Procurement;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Andrey Kurnosov
 */
@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "event")
@ToString(exclude = {"organizer", "procurements", "participants"})
public class Event extends BaseEntity {

    @Column(nullable = false)
    String name;

    @ManyToOne
    @JoinColumn(name = "organizer_id")
    private Participant organizer;

    @Builder.Default
    @OneToMany(
            mappedBy = "event",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Participant> participants = new ArrayList<>();

    @Builder.Default
    @OneToMany(
            mappedBy = "event",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Procurement> procurements = new ArrayList<>();

    @Column
    private LocalDateTime date;

    @Column
    private String place;

    @Column
    private String comment;

    @Column(precision = 10, scale = 2)
    @Unsigned
    private BigDecimal budget;

    @Column
    private String organizerCardInfo;

    public void addParticipant(Participant participant) {
        participants.add(participant);
        participant.setEvent(this);
    }

    public void removeParticipant(Participant participant) {
        participants.remove(participant);
        participant.setEvent(null);
    }

    public void addProcurement(Procurement procurement) {
        procurements.add(procurement);
        procurement.setEvent(this);
    }

    public void removeProcurement(Procurement procurement) {
        procurements.remove(procurement);
        procurement.setEvent(null);
    }
}
