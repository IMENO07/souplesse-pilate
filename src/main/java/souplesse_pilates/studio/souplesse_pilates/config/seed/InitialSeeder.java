package souplesse_pilates.studio.souplesse_pilates.config.seed;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import souplesse_pilates.studio.souplesse_pilates.repositories.UserRepository;

@Slf4j
@Component
@Profile("seed-initial")
@RequiredArgsConstructor
public class InitialSeeder implements CommandLineRunner, SeedService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Starting INITIAL database seed...");
        createAdminIfNotExists(userRepository, passwordEncoder);
        log.info("INITIAL database seed completed.");
    }
}
