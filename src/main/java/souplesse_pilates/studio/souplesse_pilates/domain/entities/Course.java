package souplesse_pilates.studio.souplesse_pilates.domain.entities;
import java.math.BigDecimal;
import java.net.URL;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import jakarta.persistence.*;
import lombok.*;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.CourseStatus;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.CourseType;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private CourseType type;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "date", nullable = false)
    private LocalDate date;
    
    @Column(name = "time", nullable = false)
    private LocalTime time;

    
    @Column(name = "capacity", nullable = false)
    private Integer capacity;
    
    @Column(name = "reserved_spots", nullable = false)
    private Integer reservedSpots;

    @Column(name = "image_url")
    private URL imageUrl;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private CourseStatus status;

    @ManyToOne
    @JoinColumn(name = "instructor_id")
    private User instructor;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.reservedSpots = 0;
        updateStatus();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    //  LOGIQUE MÉTIER CLÉ
    public int getAvailableSpots() {
        return capacity - reservedSpots;
    }

    public void updateStatus() {
        if (getAvailableSpots() <= 0) {
            this.status = CourseStatus.FULL;
        } else {
            this.status = CourseStatus.AVAILABLE;
        }
    }

    
}