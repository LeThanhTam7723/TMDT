// Order.java
package com.example.back_end.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderID")
    private Integer id;

    @Column(name = "UserID")
    private Integer userId;

    @Column(name = "CourseID")
    private Integer courseId;

    @Column(name = "DateBuy")
    private LocalDateTime dateBuy;

    @Column(name = "Status")
    private String status;

    @Column(name = "Price")
    private Double price;

    @Column(name = "PaymentID")
    private String paymentId;
}
