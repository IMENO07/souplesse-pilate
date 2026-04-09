package souplesse_pilates.studio.souplesse_pilates.services;

import java.util.List;

import souplesse_pilates.studio.souplesse_pilates.domain.dtos.requests.CreateCourseRequestDto;
import souplesse_pilates.studio.souplesse_pilates.domain.dtos.requests.UpdateCourseRequestDto;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.Course;

public interface CourseService {
    Course createCourse(CreateCourseRequestDto dto);

    Course updateCourse(Long id, UpdateCourseRequestDto dto);

    void deleteCourse(Long id);

    List<Course> getAllAvailableCourses();

    List<Course> getAllCourses();
}
