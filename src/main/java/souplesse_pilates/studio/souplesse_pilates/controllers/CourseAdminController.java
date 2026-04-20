package souplesse_pilates.studio.souplesse_pilates.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import souplesse_pilates.studio.souplesse_pilates.domain.dtos.requests.CreateCourseRequestDto;
import souplesse_pilates.studio.souplesse_pilates.domain.dtos.requests.UpdateCourseRequestDto;
import souplesse_pilates.studio.souplesse_pilates.domain.dtos.responses.CourseResponseDto;
import souplesse_pilates.studio.souplesse_pilates.mappers.CourseMapper;
import souplesse_pilates.studio.souplesse_pilates.services.AdminLogService;
import souplesse_pilates.studio.souplesse_pilates.services.CourseService;

@RestController
@RequestMapping("/admin/courses")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class CourseAdminController {
    private final CourseService courseService;
    private final CourseMapper courseMapper;
    private final AdminLogService adminLogService;

    @PostMapping
    public ResponseEntity<CourseResponseDto> create(@RequestBody @Valid CreateCourseRequestDto dto) {
        CourseResponseDto result = courseMapper.toDto(courseService.createCourse(dto));
        adminLogService.log("CREATE", "Nouvelle classe créée: " + result.title());
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseResponseDto> update(@PathVariable Long id,
                                                    @RequestBody UpdateCourseRequestDto dto) {
        CourseResponseDto result = courseMapper.toDto(courseService.updateCourse(id, dto));
        adminLogService.log("UPDATE", "Classe mise à jour: " + result.title());
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        courseService.deleteCourse(id);
        adminLogService.log("DELETE", "Classe supprimée (ID: " + id + ")");
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<CourseResponseDto>> getAll() {
        return ResponseEntity.ok(
            courseService.getAllCourses()
                .stream()
                .map(courseMapper::toDto)
                .toList()
        );
    }
}