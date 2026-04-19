package souplesse_pilates.studio.souplesse_pilates.domain.dtos.requests;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.net.URL;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.CourseStatus;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.CourseType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCourseRequestDto {
    private CourseType type;
    private String description;
    private BigDecimal price;
    private LocalDate date;
    private LocalTime time;
    private Integer capacity;
    private CourseStatus status;
    private URL imageUrl;
    private Long instructorId;
}
