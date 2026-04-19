package souplesse_pilates.studio.souplesse_pilates.config.seed;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import souplesse_pilates.studio.souplesse_pilates.domain.entities.Course;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.User;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.CourseStatus;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.CourseType;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.UserRole;
import souplesse_pilates.studio.souplesse_pilates.repositories.CourseRepository;
import souplesse_pilates.studio.souplesse_pilates.repositories.UserRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Slf4j
@Component
@Profile("seed-running")
@RequiredArgsConstructor
public class RunningSeeder implements CommandLineRunner, SeedService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Starting RUNNING database seed...");

        // 1. Admin
        createAdminIfNotExists(userRepository, passwordEncoder);

        // 2. Instructors
        User instructor1 = createInstructorIfNotExists("sara@fitbook.com", "Sara", "Smith");
        User instructor2 = createInstructorIfNotExists("marc@fitbook.com", "Marc", "Dupont");

        // 3. Courses (Upcoming)
        if (courseRepository.count() == 0) {
            log.info("Creating initial courses for RUNNING profile...");
            
            courseRepository.save(Course.builder()
                .type(CourseType.PILATES)
                .description("Pilates Reformer Débutants - Focus sur la force du tronc et l'alignement.")
                .price(new BigDecimal("2500"))
                .date(LocalDate.now().plusDays(1))
                .time(LocalTime.of(10, 0))
                .capacity(8)
                .reservedSpots(0)
                .status(CourseStatus.AVAILABLE)
                .instructor(instructor1)
                .build());

            courseRepository.save(Course.builder()
                .type(CourseType.YOGA)
                .description("Vinyasa Flow - Séquence dynamique liant le mouvement à la respiration.")
                .price(new BigDecimal("2000"))
                .date(LocalDate.now().plusDays(2))
                .time(LocalTime.of(18, 30))
                .capacity(15)
                .reservedSpots(0)
                .status(CourseStatus.AVAILABLE)
                .instructor(instructor2)
                .build());

            courseRepository.save(Course.builder()
                .type(CourseType.PILATES)
                .description("Pilates Matwork - Exercices classiques sur tapis.")
                .price(new BigDecimal("1500"))
                .date(LocalDate.now().plusDays(3))
                .time(LocalTime.of(12, 0))
                .capacity(12)
                .reservedSpots(0)
                .status(CourseStatus.AVAILABLE)
                .instructor(instructor1)
                .build());

            courseRepository.save(Course.builder()
                .type(CourseType.STRETCHING)
                .description("Étirements Profonds - Relaxation et souplesse.")
                .price(new BigDecimal("1500"))
                .date(LocalDate.now().plusDays(4))
                .time(LocalTime.of(9, 0))
                .capacity(10)
                .reservedSpots(0)
                .status(CourseStatus.AVAILABLE)
                .instructor(instructor2)
                .build());
        }

        log.info("RUNNING database seed completed.");
    }

    private User createInstructorIfNotExists(String email, String firstName, String lastName) {
        if (!userRepository.existsByEmail(email)) {
            User instructor = User.builder()
                    .firstName(firstName)
                    .lastName(lastName)
                    .email(email)
                    .password(passwordEncoder.encode("instructor123"))
                    .role(UserRole.INSTRUCTOR)
                    .build();
            return userRepository.save(instructor);
        }
        return userRepository.findByEmail(email).orElseThrow();
    }
}
