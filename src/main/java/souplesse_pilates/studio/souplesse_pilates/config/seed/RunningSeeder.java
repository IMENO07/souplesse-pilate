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
import souplesse_pilates.studio.souplesse_pilates.domain.entities.Testimonial;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.GalleryItem;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.StudioImage;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.CourseStatus;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.CourseType;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.UserRole;
import souplesse_pilates.studio.souplesse_pilates.repositories.CourseRepository;
import souplesse_pilates.studio.souplesse_pilates.repositories.ReservationRepository;
import souplesse_pilates.studio.souplesse_pilates.repositories.UserRepository;
import souplesse_pilates.studio.souplesse_pilates.repositories.TestimonialRepository;
import souplesse_pilates.studio.souplesse_pilates.repositories.GalleryItemRepository;
import souplesse_pilates.studio.souplesse_pilates.repositories.StudioImageRepository;

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
    private final TestimonialRepository testimonialRepository;
    private final GalleryItemRepository galleryItemRepository;
    private final StudioImageRepository studioImageRepository;
    private final ReservationRepository reservationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Starting RUNNING database seed — full clean rebuild...");

        // ── 1. Wipe in FK-safe order ──────────────────────────────────────────────
        log.info("Wiping existing data...");
        reservationRepository.deleteAll();
        courseRepository.deleteAll();
        galleryItemRepository.deleteAll();
        studioImageRepository.deleteAll();
        testimonialRepository.deleteAll();
        userRepository.findAll().stream()
                .filter(u -> u.getRole() != UserRole.ADMIN)
                .forEach(userRepository::delete);

        // ── 2. Ensure Admin ───────────────────────────────────────────────────────
        createAdminIfNotExists(userRepository, passwordEncoder);

        // ── 3. Instructors ────────────────────────────────────────────────────────
        log.info("Creating instructors...");
        User amira   = buildInstructor("amira@souplesse.dz",   "Amira",   "Benali");
        User yasmine = buildInstructor("yasmine@souplesse.dz", "Yasmine", "Hadj");
        User lina    = buildInstructor("lina@souplesse.dz",    "Lina",    "Mansouri");

        // ── 4. Courses ────────────────────────────────────────────────────────────
        LocalDate base = LocalDate.now();
        log.info("Creating courses for dates starting {}", base.plusDays(2));

        Course c1 = courseRepository.save(Course.builder()
                .type(CourseType.PILATES).title("Reformer Foundations")
                .description("Découvrez les bases du Reformer Pilates dans un cadre bienveillant. Idéal pour commencer votre voyage.")
                .price(new BigDecimal("2500"))
                .date(base.plusDays(2)).time(LocalTime.of(10, 0))
                .capacity(8).reservedSpots(2).status(CourseStatus.AVAILABLE)
                .instructor(amira)
                .imageUrl("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80")
                .build());

        Course c2 = courseRepository.save(Course.builder()
                .type(CourseType.PILATES).title("Core & Flow")
                .description("Un enchaînement fluide axé sur le centre du corps. Respirez, connectez-vous et progressez.")
                .price(new BigDecimal("2000"))
                .date(base.plusDays(3)).time(LocalTime.of(18, 30))
                .capacity(6).reservedSpots(1).status(CourseStatus.AVAILABLE)
                .instructor(yasmine)
                .imageUrl("https://images.unsplash.com/photo-1540206395-68808572332f?w=800&q=80")
                .build());

        Course c3 = courseRepository.save(Course.builder()
                .type(CourseType.STRETCHING).title("Stretch & Restore")
                .description("Séance douce de récupération active. Étirements profonds et relâchement musculaire complet.")
                .price(new BigDecimal("1500"))
                .date(base.plusDays(4)).time(LocalTime.of(12, 0))
                .capacity(10).reservedSpots(5).status(CourseStatus.AVAILABLE)
                .instructor(lina)
                .imageUrl("https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800&q=80")
                .build());

        Course c4 = courseRepository.save(Course.builder()
                .type(CourseType.PILATES).title("Power Reformer")
                .description("Challenge cardio-musculaire intensif. Poussez vos limites sur le Reformer.")
                .price(new BigDecimal("3000"))
                .date(base.plusDays(5)).time(LocalTime.of(19, 0))
                .capacity(5).reservedSpots(4).status(CourseStatus.AVAILABLE)
                .instructor(amira)
                .imageUrl("https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80")
                .build());

        Course c5 = courseRepository.save(Course.builder()
                .type(CourseType.PILATES).title("Barre & Balance")
                .description("Associez la danse classique et le Pilates pour sculpter et tonifier en douceur.")
                .price(new BigDecimal("2500"))
                .date(base.plusDays(6)).time(LocalTime.of(17, 30))
                .capacity(8).reservedSpots(0).status(CourseStatus.AVAILABLE)
                .instructor(yasmine)
                .imageUrl("https://images.unsplash.com/photo-1601925228008-e9acc5c9adce?w=800&q=80")
                .build());

        // ── 5. Client Reservations ────────────────────────────────────────────────
        log.info("Creating sample client reservations...");
        saveReservation("Amira",   "Bensalem", "amira.bensalem@email.dz",   c1);
        saveReservation("Yasmine", "Kaddour",  "yasmine.k@email.dz",        c1);
        saveReservation("Sofia",   "Mansouri", "sofia.m@gmail.com",         c2);
        saveReservation("Nadia",   "Larbi",    "nadia.larbi@email.dz",      c3);
        saveReservation("Rima",    "Hadj",     "rima.hadj@email.dz",        c3);
        saveReservation("Lina",    "Saidi",    "lina.saidi@outlook.com",    c3);
        saveReservation("Hana",    "Meziane",  "hana.m@email.dz",           c3);
        saveReservation("Sarah",   "Benali",   "sarah.benali@gmail.com",    c4);
        saveReservation("Kenza",   "Ouali",    "kenza.ouali@email.dz",      c4);
        saveReservation("Meriem",  "Taibi",    "meriem.t@email.dz",         c4);
        saveReservation("Dalia",   "Cheikh",   "dalia.cheikh@gmail.com",    c4);
        saveReservation("Sana",    "Brahim",   "sana.brahim@email.dz",      c5);

        // ── 6. Testimonials ───────────────────────────────────────────────────────
        log.info("Creating testimonials...");
        testimonialRepository.save(Testimonial.builder()
                .text("Le studio m'a transformée. L'atmosphère, les instructeurs — chaque détail est pensé pour le mouvement.")
                .name("Amira B.").role("Membre depuis 2023").displayOrder(1).build());
        testimonialRepository.save(Testimonial.builder()
                .text("J'ai essayé des dizaines de studios. Souplesse est le seul où je me sens vraiment chez moi.")
                .name("Yasmina K.").role("Pratiquante régulière").displayOrder(2).build());
        testimonialRepository.save(Testimonial.builder()
                .text("La qualité de l'enseignement ici est incomparable. Mon corps n'a jamais été aussi fort.")
                .name("Sofia M.").role("6 mois de pratique").displayOrder(3).build());
        testimonialRepository.save(Testimonial.builder()
                .text("Un havre de paix en plein cœur d'Alger. Chaque séance est un moment de reconnexion avec soi.")
                .name("Nadia L.").role("Membre fondatrice").displayOrder(4).build());

        // ── 7. Gallery ────────────────────────────────────────────────────────────
        log.info("Creating gallery items...");
        galleryItemRepository.save(GalleryItem.builder().imageUrl("https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80").caption("Morning Flow").likes(2340).featured(false).displayOrder(1).build());
        galleryItemRepository.save(GalleryItem.builder().imageUrl("https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80").caption("Studio Arches").likes(3120).featured(true).displayOrder(2).build());
        galleryItemRepository.save(GalleryItem.builder().imageUrl("https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=80").caption("Reformer Precision").likes(1890).featured(false).displayOrder(3).build());
        galleryItemRepository.save(GalleryItem.builder().imageUrl("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80").caption("Glass Wall Session").likes(4100).featured(true).displayOrder(4).build());
        galleryItemRepository.save(GalleryItem.builder().imageUrl("https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80").caption("Sunset Stretch").likes(2780).featured(false).displayOrder(5).build());
        galleryItemRepository.save(GalleryItem.builder().imageUrl("https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80").caption("Community Day").likes(3560).featured(false).displayOrder(6).build());

        // ── 8. Studio Images ──────────────────────────────────────────────────────
        log.info("Creating studio images...");
        studioImageRepository.save(StudioImage.builder().imageUrl("https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80").displayOrder(1).build());
        studioImageRepository.save(StudioImage.builder().imageUrl("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80").displayOrder(2).build());

        log.info("RUNNING database seed completed successfully.");
    }

    private User buildInstructor(String email, String firstName, String lastName) {
        return userRepository.save(User.builder()
                .firstName(firstName).lastName(lastName).email(email)
                .password(passwordEncoder.encode("instructor123"))
                .role(UserRole.INSTRUCTOR).build());
    }

    private void saveReservation(String firstName, String lastName, String email, Course course) {
        reservationRepository.save(Reservation.builder()
                .firstName(firstName).lastName(lastName).email(email)
                .course(course).build());
    }
}
