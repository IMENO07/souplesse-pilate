package souplesse_pilates.studio.souplesse_pilates.domain.dtos.responses;

public record UserResponseDto(
    Long id,
    String firstName,
    String lastName,
    String email,
    String role
) {}
