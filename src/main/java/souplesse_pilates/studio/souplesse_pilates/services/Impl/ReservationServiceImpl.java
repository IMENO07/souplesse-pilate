package souplesse_pilates.studio.souplesse_pilates.services.Impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import souplesse_pilates.studio.souplesse_pilates.domain.dtos.requests.CreateReservationRequestDto;
import souplesse_pilates.studio.souplesse_pilates.domain.dtos.requests.UpdateReservationRequestDto;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.Course;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.Reservation;
import souplesse_pilates.studio.souplesse_pilates.repositories.CourseRepository;
import souplesse_pilates.studio.souplesse_pilates.repositories.ReservationRepository;
import souplesse_pilates.studio.souplesse_pilates.services.EmailService;
import souplesse_pilates.studio.souplesse_pilates.services.ReservationService;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final CourseRepository courseRepository;
    private final EmailService emailService;

    @Override
    @Transactional
    public Reservation createReservation(CreateReservationRequestDto dto) {

        // 1. Load course
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Course not found with id: " + dto.getCourseId()));

        // 2. Check course is not full
        if (course.getAvailableSpots() <= 0) {
            throw new IllegalStateException(
                    "This course is fully booked. No spots remaining.");
        }

        // 3. Block duplicate bookings
        if (reservationRepository.existsByEmailAndCourseId(dto.getEmail(), dto.getCourseId())) {
            throw new IllegalArgumentException(
                    "A booking already exists for " + dto.getEmail() + " in this course.");
        }

        // 4. Save reservation
        Reservation reservation = Reservation.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .course(course)
                .build();

        reservationRepository.save(reservation);

        // 5. Update course spot count
        course.setReservedSpots(course.getReservedSpots() + 1);
        course.updateStatus();
        courseRepository.save(course);

        // 6. Send emails asynchronously — never blocks, never rolls back booking
        emailService.sendClientConfirmation(reservation);
        emailService.sendInstructorNotification(reservation);

        return reservation;
    }

    @Override
    public List<Reservation> getReservationsByCourse(Long courseId) {
        return reservationRepository.findByCourseId(courseId);
    }

    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Override
    @Transactional
    public Reservation updateReservation(Long id, UpdateReservationRequestDto dto) {

        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Reservation not found with id: " + id));

        // If the email is changing, make sure the new email doesn't
        // already have a booking for the same course
        if (!reservation.getEmail().equals(dto.getEmail())) {
            if (reservationRepository.existsByEmailAndCourseId(
                    dto.getEmail(), reservation.getCourse().getId())) {
                throw new IllegalArgumentException(
                        "A booking already exists for " + dto.getEmail() + " in this course.");
            }
        }

        reservation.setFirstName(dto.getFirstName());
        reservation.setLastName(dto.getLastName());
        reservation.setEmail(dto.getEmail());

        return reservationRepository.save(reservation);
    }

    @Override
    @Transactional
    public void deleteReservation(Long id) {

        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Reservation not found with id: " + id));

        // Free up the spot on the course
        Course course = reservation.getCourse();
        course.setReservedSpots(Math.max(0, course.getReservedSpots() - 1));
        course.updateStatus();
        courseRepository.save(course);

        reservationRepository.delete(reservation);
    }
}