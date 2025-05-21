package com.example.back_end.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "course")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CourseID")
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "price")
    private Double price;

    @Column(name = "SellerID")
    private Integer sellerId;

    @Column(name = "CategoryID")
    private Integer categoryId;

    @Column(name = "Description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "Rating")
    private Double rating;

    @Column(name = "Status")
    private Boolean status;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CourseDetail> courseDetails;
}
