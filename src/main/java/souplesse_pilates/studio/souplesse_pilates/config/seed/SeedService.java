package souplesse_pilates.studio.souplesse_pilates.config.seed;

import org.springframework.security.crypto.password.PasswordEncoder;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.User;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.UserRole;
import souplesse_pilates.studio.souplesse_pilates.repositories.UserRepository;

public interface SeedService {

    default void createAdminIfNotExists(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        if (!userRepository.existsByEmail("admin@souplesse.dz")) {
            userRepository.save(User.builder()
                    .firstName("Admin")
                    .lastName("Souplesse")
                    .email("admin@souplesse.dz")
                    .password(passwordEncoder.encode("admin123"))
                    .role(UserRole.ADMIN)
                    .build());
        }
    }
}
