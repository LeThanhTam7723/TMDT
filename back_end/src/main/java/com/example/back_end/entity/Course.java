package com.example.back_end.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
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
    @JsonManagedReference
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CourseDetail> courseDetails;
}
