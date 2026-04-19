package souplesse_pilates.studio.souplesse_pilates.domain.dtos.responses;

import java.math.BigDecimal;
import java.net.URL;
import java.time.LocalDate;
import java.time.LocalTime;

import souplesse_pilates.studio.souplesse_pilates.domain.enums.CourseStatus;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.CourseType;

public record CourseResponseDto(
    Long id,
    CourseType type,
    String title,
    String coachFirstName,
    String coachLastName,
    String coachEmail,
    String description,
    BigDecimal price,
    LocalDate date,
    LocalTime time,
    Integer capacity,
    Integer reservedSpots,
    CourseStatus status,
    URL imageUrl,
    Long instructorId
) {
}