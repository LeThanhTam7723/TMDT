package com.example.back_end.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "coursedetail")
public class CourseDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // tạo ID riêng vì bảng không có khóa chính rõ ràng trong ảnh

    @ManyToOne
    @JoinColumn(name = "course_id")
    @JsonIgnore // Avoid infinite recursion
    private Course course;

    @Column(name = "EpisodeNumber")
    private Integer episodeNumber;

    @Column(name = "Link")
    private String link;

    @Column(name = "Duration")
    private Integer duration;

    @Column(name = "IsPreview")
    private Boolean isPreview;
}
