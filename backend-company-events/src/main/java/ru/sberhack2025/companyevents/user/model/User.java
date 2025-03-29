package ru.sberhack2025.companyevents.user.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import ru.sberhack2025.companyevents.core.model.BaseEntity;
import ru.sberhack2025.companyevents.participant.model.Participant;

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
@Table(name = "\"user\"")
@ToString(exclude = {"participations"})
public class User extends BaseEntity {

    @Column(name = "tg_user_id", nullable = false)
    Long tgUserId;

    @Column
    String name;

    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Participant> participations = new ArrayList<>();

    public void addParticipations(Participant participant) {
        participations.add(participant);
        participant.setUser(this);
    }

    public void removeParticipations(Participant participant) {
        participations.remove(participant);
        participant.setUser(null);
    }

}
