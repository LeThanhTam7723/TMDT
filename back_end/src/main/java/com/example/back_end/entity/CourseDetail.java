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
    private Integer id; // tạo ID riêng vì bảng không có khóa chính rõ ràng trong ảnh

    @Column(name = "courseid")
    private Integer courseId;

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

    @ManyToOne
    @JoinColumn(name = "course_id")
    @JsonIgnore
//    @JoinColumn(name = "CourseID", insertable = false, updatable = false)
    private Course course;
}
