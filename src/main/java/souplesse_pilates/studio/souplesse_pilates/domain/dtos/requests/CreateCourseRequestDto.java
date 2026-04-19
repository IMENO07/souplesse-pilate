package souplesse_pilates.studio.souplesse_pilates.domain.dtos.requests;
import java.math.BigDecimal;
import java.net.URL;
import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.CourseType;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class CreateCourseRequestDto {
    @NotNull
    private CourseType type;

    private String title;
    private String coachFirstName;
    private String coachLastName;
    private String coachEmail;

    @NotBlank
    private String description;

    @NotNull
    private BigDecimal price;

    @NotNull
    private LocalDate date;

    @NotNull
    private LocalTime time;

    @NotNull
    private Integer capacity;

    private URL imageUrl;

    @NotNull
    private Long instructorId;
}
