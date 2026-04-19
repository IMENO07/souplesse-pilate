package souplesse_pilates.studio.souplesse_pilates.config.seed;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import souplesse_pilates.studio.souplesse_pilates.domain.entities.Course;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.Reservation;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.User;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.CourseStatus;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.CourseType;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.UserRole;
import souplesse_pilates.studio.souplesse_pilates.repositories.CourseRepository;
import souplesse_pilates.studio.souplesse_pilates.repositories.ReservationRepository;
import souplesse_pilates.studio.souplesse_pilates.repositories.UserRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@Profile("seed-testing")
@RequiredArgsConstructor
public class TestingSeeder implements CommandLineRunner, SeedService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final ReservationRepository reservationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Starting TESTING database seed (High Volume & Edge Cases)...");

        // 1. Admin
        createAdminIfNotExists(userRepository, passwordEncoder);

        // 2. Instructors (5 total)
        List<User> instructors = new ArrayList<>();
        instructors.add(createInstructorIfNotExists("anna@fitbook.com", "Anna", "Lee"));
        instructors.add(createInstructorIfNotExists("ben@fitbook.com", "Ben", "Stokes"));
        instructors.add(createInstructorIfNotExists("chloe@fitbook.com", "Chloe", "Martin"));
        instructors.add(createInstructorIfNotExists("david@fitbook.com", "David", "Kim"));
        instructors.add(createInstructorIfNotExists("emma@fitbook.com", "Emma", "Watson"));

        // 3. Courses (15 total: past, present, full, available)
        if (courseRepository.count() == 0) {
            log.info("Creating TESTING courses...");

            Course[] courses = new Course[15];

            // 5 Past Courses
            for (int i = 0; i < 5; i++) {
                courses[i] = courseRepository.save(Course.builder()
                        .type(CourseType.PILATES)
                        .description("Classe Passée " + i)
                        .price(new BigDecimal("2500"))
                        .date(LocalDate.now().minusDays(i + 1))
                        .time(LocalTime.of(10 + i, 0))
                        .capacity(10)
                        .reservedSpots(0)
                        .status(CourseStatus.AVAILABLE)
                        .instructor(instructors.get(i % 5))
                        .build());
            }

            // 5 Future Available Courses
            for (int i = 5; i < 10; i++) {
                courses[i] = courseRepository.save(Course.builder()
                        .type(CourseType.YOGA)
                        .description("Classe Future Disponible " + i)
                        .price(new BigDecimal("2000"))
                        .date(LocalDate.now().plusDays(i - 4))
                        .time(LocalTime.of(8 + i % 5, 30))
                        .capacity(15)
                        .reservedSpots(0)
                        .status(CourseStatus.AVAILABLE)
                        .instructor(instructors.get(i % 5))
                        .build());
            }

            // 5 Future FULL Courses (Capacity 1, will be fully booked)
            for (int i = 10; i < 15; i++) {
                courses[i] = courseRepository.save(Course.builder()
                        .type(CourseType.STRETCHING)
                        .description("Classe Future COMPLÈTE " + i)
                        .price(new BigDecimal("1500"))
                        .date(LocalDate.now().plusDays(i - 9))
                        .time(LocalTime.of(18 + i % 3, 0))
                        .capacity(2) // Capacity 2 so we can book it twice to fill it
                        .reservedSpots(0)
                        .status(CourseStatus.AVAILABLE)
                        .instructor(instructors.get(i % 5))
                        .build());
            }

            // 4. Reservations (Book the Full courses + some others)
            log.info("Creating TESTING reservations...");
            for (int i = 10; i < 15; i++) {
                Course fullCourse = courses[i];
                
                // Book spot 1
                reservationRepository.save(Reservation.builder()
                        .firstName("TestClientA")
                        .lastName("Doe")
                        .email("clienta_" + i + "@test.com")
                        .course(fullCourse)
                        .build());
                
                // Book spot 2
                reservationRepository.save(Reservation.builder()
                        .firstName("TestClientB")
                        .lastName("Smith")
                        .email("clientb_" + i + "@test.com")
                        .course(fullCourse)
                        .build());

                // Manually update reserved spots & status since we bypassed the service layer
                fullCourse.setReservedSpots(2);
                fullCourse.updateStatus();
                courseRepository.save(fullCourse);
            }
        }

        log.info("TESTING database seed completed.");
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
