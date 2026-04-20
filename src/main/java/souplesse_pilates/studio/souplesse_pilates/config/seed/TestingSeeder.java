package souplesse_pilates.studio.souplesse_pilates.config.seed;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import souplesse_pilates.studio.souplesse_pilates.domain.entities.Course;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.GalleryItem;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.Reservation;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.StudioImage;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.Testimonial;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.User;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.CourseStatus;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.CourseType;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.UserRole;
import souplesse_pilates.studio.souplesse_pilates.repositories.CourseRepository;
import souplesse_pilates.studio.souplesse_pilates.repositories.GalleryItemRepository;
import souplesse_pilates.studio.souplesse_pilates.repositories.ReservationRepository;
import souplesse_pilates.studio.souplesse_pilates.repositories.StudioImageRepository;
import souplesse_pilates.studio.souplesse_pilates.repositories.TestimonialRepository;
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
    private final TestimonialRepository testimonialRepository;
    private final GalleryItemRepository galleryItemRepository;
    private final StudioImageRepository studioImageRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Starting TESTING database seed — full clean rebuild...");

        // ── 1. Wipe in FK-safe order ──────────────────────────────────────────────
        reservationRepository.deleteAll();
        courseRepository.deleteAll();
        galleryItemRepository.deleteAll();
        studioImageRepository.deleteAll();
        testimonialRepository.deleteAll();
        userRepository.findAll().stream()
                .filter(u -> u.getRole() != UserRole.ADMIN)
                .forEach(userRepository::delete);

        // ── 2. Admin ──────────────────────────────────────────────────────────────
        createAdminIfNotExists(userRepository, passwordEncoder);

        // ── 3. Instructors ────────────────────────────────────────────────────────
        List<User> instructors = new ArrayList<>();
        instructors.add(buildInstructor("anna@souplesse.dz",   "Anna",   "Lee"));
        instructors.add(buildInstructor("ben@souplesse.dz",    "Ben",    "Stokes"));
        instructors.add(buildInstructor("chloe@souplesse.dz",  "Chloe",  "Martin"));
        instructors.add(buildInstructor("david@souplesse.dz",  "David",  "Kim"));
        instructors.add(buildInstructor("emma@souplesse.dz",   "Emma",   "Watson"));
        instructors.add(buildInstructor("felix@souplesse.dz",  "Felix",  "Gomez"));
        instructors.add(buildInstructor("gina@souplesse.dz",   "Gina",   "Carano"));
        instructors.add(buildInstructor("hugo@souplesse.dz",   "Hugo",   "Boss"));
        instructors.add(buildInstructor("iris@souplesse.dz",   "Iris",   "West"));
        instructors.add(buildInstructor("jack@souplesse.dz",   "Jack",   "Reacher"));

        // ── 4. Courses (15 total: past, available, full) ──────────────────────────
        log.info("Creating TESTING courses...");
        LocalDate base = LocalDate.now();
        Course[] courses = new Course[15];

        // 5 past courses
        for (int i = 0; i < 5; i++) {
            courses[i] = courseRepository.save(Course.builder()
                    .type(CourseType.PILATES)
                    .title("Classe Passée " + (i + 1))
                    .description("Séance passée pour tests — cours " + (i + 1))
                    .price(new BigDecimal("2500"))
                    .date(base.minusDays(i + 1)).time(LocalTime.of(10 + i, 0))
                    .capacity(10).reservedSpots(0).status(CourseStatus.AVAILABLE)
                    .instructor(instructors.get(i % 5)).build());
        }

        // 5 future available courses
        for (int i = 5; i < 10; i++) {
            courses[i] = courseRepository.save(Course.builder()
                    .type(CourseType.YOGA)
                    .title("Yoga Disponible " + (i - 4))
                    .description("Classe future disponible — cours " + (i - 4))
                    .price(new BigDecimal("2000"))
                    .date(base.plusDays(i - 4)).time(LocalTime.of(8 + (i % 5), 30))
                    .capacity(15).reservedSpots(0).status(CourseStatus.AVAILABLE)
                    .instructor(instructors.get(i % 5)).build());
        }

        // 5 future full courses (capacity 2, will be fully booked)
        for (int i = 10; i < 15; i++) {
            courses[i] = courseRepository.save(Course.builder()
                    .type(CourseType.STRETCHING)
                    .title("Stretching COMPLET " + (i - 9))
                    .description("Classe future complète — cours " + (i - 9))
                    .price(new BigDecimal("1500"))
                    .date(base.plusDays(i - 9)).time(LocalTime.of(18 + (i % 3), 0))
                    .capacity(2).reservedSpots(0).status(CourseStatus.AVAILABLE)
                    .instructor(instructors.get(i % 5)).build());
        }

        // ── 5. Reservations ───────────────────────────────────────────────────────
        log.info("Creating TESTING reservations...");
        // Book the 5 full courses to capacity
        for (int i = 10; i < 15; i++) {
            Course full = courses[i];
            reservationRepository.save(Reservation.builder()
                    .firstName("ClientA").lastName("Test")
                    .email("clienta_" + i + "@test.com").course(full).build());
            reservationRepository.save(Reservation.builder()
                    .firstName("ClientB").lastName("Test")
                    .email("clientb_" + i + "@test.com").course(full).build());
            full.setReservedSpots(2);
            full.updateStatus();
            courseRepository.save(full);
        }
        // Partial reservations on some available courses
        for (int i = 5; i < 8; i++) {
            reservationRepository.save(Reservation.builder()
                    .firstName("ClientC").lastName("Test")
                    .email("clientc_" + i + "@test.com").course(courses[i]).build());
        }

        // ── 6. Testimonials ───────────────────────────────────────────────────────
        testimonialRepository.save(Testimonial.builder()
                .text("Excellent studio — idéal pour débuter ou progresser.").name("Test User A")
                .role("Membre test").displayOrder(1).build());
        testimonialRepository.save(Testimonial.builder()
                .text("Les séances sont bien structurées et le staff est accueillant.").name("Test User B")
                .role("Pratiquant test").displayOrder(2).build());

        // ── 7. Gallery ────────────────────────────────────────────────────────────
        galleryItemRepository.save(GalleryItem.builder()
                .imageUrl("https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80")
                .caption("Test Gallery 1").likes(100).featured(true).displayOrder(1).build());
        galleryItemRepository.save(GalleryItem.builder()
                .imageUrl("https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80")
                .caption("Test Gallery 2").likes(200).featured(false).displayOrder(2).build());

        // ── 8. Studio Images ──────────────────────────────────────────────────────
        studioImageRepository.save(StudioImage.builder()
                .imageUrl("https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80")
                .displayOrder(1).build());

        log.info("TESTING database seed completed — {} courses, reservations seeded.", courses.length);
    }

    private User buildInstructor(String email, String firstName, String lastName) {
        return userRepository.save(User.builder()
                .firstName(firstName).lastName(lastName).email(email)
                .password(passwordEncoder.encode("instructor123"))
                .role(UserRole.INSTRUCTOR).build());
    }
}
