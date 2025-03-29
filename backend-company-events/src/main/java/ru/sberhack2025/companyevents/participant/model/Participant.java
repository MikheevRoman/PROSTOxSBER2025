package ru.sberhack2025.companyevents.participant.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import ru.sberhack2025.companyevents.core.model.BaseEntity;
import ru.sberhack2025.companyevents.event.model.Event;
import ru.sberhack2025.companyevents.procurement.model.Procurement;
import ru.sberhack2025.companyevents.user.model.User;

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
@Table(name = "participant")
@ToString(exclude = {"event", "user", "responsibleProcurements", "contributedProcurements"})
public class Participant extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    Event event;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @Builder.Default
    @OneToMany(mappedBy = "responsible", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Procurement> responsibleProcurements = new ArrayList<>();

    @Builder.Default
    @ManyToMany(mappedBy = "contributors")
    private List<Procurement> contributedProcurements = new ArrayList<>();

    @Builder.Default
    @Column(name = "is_organizer", nullable = false)
    Boolean isOrganizer = false;

    @Builder.Default
    @Column(name = "has_payment", nullable = false)
    Boolean hasPayment = false;

    public void addResponsibleProcurement(Procurement procurement) {
        responsibleProcurements.add(procurement);
        procurement.setResponsible(this);
    }

    public void removeResponsibleProcurement(Procurement procurement) {
        responsibleProcurements.remove(procurement);
        procurement.setResponsible(null);
    }

    public void addContributedProcurement(Procurement procurement) {
        contributedProcurements.add(procurement);
        procurement.getContributors().add(this);
    }

    public void removeContributedProcurement(Procurement procurement) {
        contributedProcurements.remove(procurement);
        procurement.getContributors().remove(this);
    }


}


