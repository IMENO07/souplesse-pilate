package souplesse_pilates.studio.souplesse_pilates.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.Reservation;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    boolean existsByEmailAndCourseId(String email, Long courseId);

    List<Reservation> findByCourseId(Long courseId);

    void deleteByCourseId(Long courseId);
}