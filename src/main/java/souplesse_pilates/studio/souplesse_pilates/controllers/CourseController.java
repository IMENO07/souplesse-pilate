package souplesse_pilates.studio.souplesse_pilates.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import souplesse_pilates.studio.souplesse_pilates.domain.dtos.responses.CourseResponseDto;
import souplesse_pilates.studio.souplesse_pilates.mappers.CourseMapper;
import souplesse_pilates.studio.souplesse_pilates.services.CourseService;

@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor

public class CourseController {
    private final CourseService courseService;
    private final CourseMapper courseMapper;

    @GetMapping
    public ResponseEntity<List<CourseResponseDto>> getAvailableCourses() {

        return ResponseEntity.ok(
            courseService.getAllAvailableCourses()
                .stream()
                .map(courseMapper::toDto)
                .toList()
        );
    }
}
