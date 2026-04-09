package souplesse_pilates.studio.souplesse_pilates.services;

import java.security.Key;

public interface JwtService {

    Key getKey();

    String extractEmail(String token);

    String extractRole(String token);

    boolean isValid(String token);

    String generateToken(String email, String role);
}
