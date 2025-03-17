package ru.sberhack2025.companyevents.test.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

/**
 * @author Andrey Kurnosov
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "test")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Test {

    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column
    String name;
}
