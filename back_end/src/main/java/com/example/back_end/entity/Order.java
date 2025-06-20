// Order.java
package com.example.back_end.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@AllArgsConstructor
@RequiredArgsConstructor
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_user", nullable = false, referencedColumnName = "id")
    private User idUser;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_course", nullable = false, referencedColumnName = "CourseID")
    private Course idCourse;

    @Column(name = "date_order", nullable = false)
    private LocalDate dateOrder;

}
