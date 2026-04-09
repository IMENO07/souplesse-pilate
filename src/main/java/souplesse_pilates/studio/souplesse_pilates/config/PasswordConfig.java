package souplesse_pilates.studio.souplesse_pilates.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import souplesse_pilates.studio.souplesse_pilates.domain.entities.User;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.UserRole;
import souplesse_pilates.studio.souplesse_pilates.repositories.UserRepository;

@Configuration
public class PasswordConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    CommandLineRunner initAdmin(UserRepository repo, PasswordEncoder encoder) {
        return args -> {
            if (!repo.existsByEmail("admin@fitbook.com")) {
                repo.save(User.builder()
                        .firstName("Admin")
                        .lastName("Fitbook")
                        .email("admin@fitbook.com")
                        .password(encoder.encode("admin123"))
                        .role(UserRole.ADMIN)
                        .build());
            }
        };
    }
}
