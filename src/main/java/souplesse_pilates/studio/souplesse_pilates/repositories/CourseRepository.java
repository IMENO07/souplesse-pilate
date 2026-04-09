package souplesse_pilates.studio.souplesse_pilates.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import souplesse_pilates.studio.souplesse_pilates.domain.entities.Course;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.CourseStatus;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByInstructorId(Long instructorId);
    List<Course> findByStatus(CourseStatus status);
}
