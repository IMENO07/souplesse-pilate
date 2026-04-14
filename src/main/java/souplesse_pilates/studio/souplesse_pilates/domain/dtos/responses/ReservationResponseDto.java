package souplesse_pilates.studio.souplesse_pilates.domain.dtos.responses;

import java.time.LocalDateTime;

public record ReservationResponseDto(
    Long id,
    String firstName,
    String lastName,
    String email,
    Long courseId,
    String courseType,
    String courseDate,
    String courseTime,
    LocalDateTime bookedAt
) {}