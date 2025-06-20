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

    @Column(name = "CourseID")
    private Integer courseId;

    @Column(name = "Name")
    private String name;

    @Column(name = "EpisodeNumber")
    private Integer episodeNumber;

    @Column(name = "Link")
    private String link;

    @Column(name = "Duration")
    private Integer duration;

    @Column(name = "IsPreview")
    private Boolean isPreview;

    @ManyToOne
    @JoinColumn(name = "course_id")
    @JsonIgnore
//    @JoinColumn(name = "CourseID", insertable = false, updatable = false)
    private Course course;
}
