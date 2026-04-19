package souplesse_pilates.studio.souplesse_pilates.config.seed;

import org.springframework.security.crypto.password.PasswordEncoder;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.User;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.UserRole;
import souplesse_pilates.studio.souplesse_pilates.repositories.UserRepository;

public interface SeedService {

    default void createAdminIfNotExists(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        if (!userRepository.existsByEmail("admin@fitbook.com")) {
            userRepository.save(User.builder()
                    .firstName("Admin")
                    .lastName("Fitbook")
                    .email("admin@fitbook.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(UserRole.ADMIN)
                    .build());
        }
    }
}
