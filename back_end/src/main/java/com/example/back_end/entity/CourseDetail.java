package com.example.back_end.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "coursedetail")
public class CourseDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "episode_number")
    private Integer episodeNumber;

    @Column(name = "link")
    private String link;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "is_preview")
    private Boolean isPreview;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "courseid")
    @JsonIgnore
    private Course course;
    
    // Helper method để get courseId từ course relationship
    public Integer getCourseId() {
        return course != null ? course.getId() : null;
    }
}
