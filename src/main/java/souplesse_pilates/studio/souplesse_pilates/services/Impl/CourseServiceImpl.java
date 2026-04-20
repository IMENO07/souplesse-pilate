package souplesse_pilates.studio.souplesse_pilates.services.Impl;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import souplesse_pilates.studio.souplesse_pilates.domain.dtos.requests.CreateCourseRequestDto;
import souplesse_pilates.studio.souplesse_pilates.domain.dtos.requests.UpdateCourseRequestDto;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.Course;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.User;
import souplesse_pilates.studio.souplesse_pilates.domain.enums.CourseStatus;
import souplesse_pilates.studio.souplesse_pilates.repositories.CourseRepository;
import souplesse_pilates.studio.souplesse_pilates.repositories.ReservationRepository;
import souplesse_pilates.studio.souplesse_pilates.repositories.UserRepository;
import souplesse_pilates.studio.souplesse_pilates.services.CourseService;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;

    @Override
    public Course createCourse(CreateCourseRequestDto dto) {

        User instructor = userRepository.findById(dto.getInstructorId())
            .orElseThrow(() -> new EntityNotFoundException("Instructor not found"));

        if (!instructor.getRole().name().equals("INSTRUCTOR")) {
            throw new IllegalArgumentException("User is not an instructor");
        }

        String coachFirstName = (dto.getCoachFirstName() == null || dto.getCoachFirstName().isBlank() || dto.getCoachFirstName().equals("Coach")) ? instructor.getFirstName() : dto.getCoachFirstName();
        String coachLastName = (dto.getCoachLastName() == null || dto.getCoachLastName().isBlank() || dto.getCoachLastName().equals("Name")) ? instructor.getLastName() : dto.getCoachLastName();
        String coachEmail = (dto.getCoachEmail() == null || dto.getCoachEmail().isBlank() || dto.getCoachEmail().equals("coach@example.com")) ? instructor.getEmail() : dto.getCoachEmail();

        Course course = Course.builder()
            .type(dto.getType())
            .description(dto.getDescription())
            .price(dto.getPrice())
            .date(dto.getDate())
            .time(dto.getTime())
            .capacity(dto.getCapacity())
            .title(dto.getTitle())
            .coachFirstName(coachFirstName)
            .coachLastName(coachLastName)
            .coachEmail(coachEmail)
            .imageUrl(dto.getImageUrl())
            .instructor(instructor)
            .build();

        course.updateStatus();

        return courseRepository.save(course);
    }

    @Override
    public Course updateCourse(Long id, UpdateCourseRequestDto dto) {

        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Course not found"));

        if (dto.getCapacity() != null) {
            course.setCapacity(dto.getCapacity());
        }

        if (dto.getDescription() != null) {
            course.setDescription(dto.getDescription());
        }

        if (dto.getPrice() != null) {
            course.setPrice(dto.getPrice());
        }

        if (dto.getDate() != null) {
            course.setDate(dto.getDate());
        }

        if (dto.getTime() != null) {
            course.setTime(dto.getTime());
        }

        if (dto.getType() != null) {
            course.setType(dto.getType());
        }

        if (dto.getImageUrl() != null) {
            course.setImageUrl(dto.getImageUrl());
        }

        if (dto.getTitle() != null) {
            course.setTitle(dto.getTitle());
        }
        if (dto.getCoachFirstName() != null && !dto.getCoachFirstName().isBlank() && !dto.getCoachFirstName().equals("Coach")) {
            course.setCoachFirstName(dto.getCoachFirstName());
        }
        if (dto.getCoachLastName() != null && !dto.getCoachLastName().isBlank() && !dto.getCoachLastName().equals("Name")) {
            course.setCoachLastName(dto.getCoachLastName());
        }
        if (dto.getCoachEmail() != null && !dto.getCoachEmail().isBlank() && !dto.getCoachEmail().equals("coach@example.com")) {
            course.setCoachEmail(dto.getCoachEmail());
        }

        if (dto.getInstructorId() != null) {
            User instructor = userRepository.findById(dto.getInstructorId())
                .orElseThrow(() -> new EntityNotFoundException("Instructor not found"));
            course.setInstructor(instructor);
            
            // Sync names if they were previously default or null
            if (course.getCoachFirstName() == null || course.getCoachFirstName().equals("Coach")) {
                course.setCoachFirstName(instructor.getFirstName());
            }
            if (course.getCoachLastName() == null || course.getCoachLastName().equals("Name")) {
                course.setCoachLastName(instructor.getLastName());
            }
        }

        course.updateStatus();

        return courseRepository.save(course);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void deleteCourse(Long id) {
        reservationRepository.deleteByCourseId(id);
        courseRepository.deleteById(id);
    }

    @Override
    public List<Course> getAllAvailableCourses() {
        return courseRepository.findByStatus(CourseStatus.AVAILABLE);
    }

    @Override
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
}