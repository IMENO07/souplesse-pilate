package souplesse_pilates.studio.souplesse_pilates.domain.dtos.responses;

import java.time.LocalDateTime;

public record UserResponseDto(
    Long id,
    String firstName,
    String lastName,
    String email,
    String role,
    LocalDateTime createdAt
) {}
