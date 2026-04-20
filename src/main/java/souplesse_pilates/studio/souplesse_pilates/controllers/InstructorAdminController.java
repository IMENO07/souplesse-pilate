package souplesse_pilates.studio.souplesse_pilates.controllers;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

import souplesse_pilates.studio.souplesse_pilates.domain.dtos.requests.UserRequestDto;
import souplesse_pilates.studio.souplesse_pilates.domain.dtos.requests.UpdateInstructorRequestDto;
import souplesse_pilates.studio.souplesse_pilates.domain.dtos.responses.UserResponseDto;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.User;
import souplesse_pilates.studio.souplesse_pilates.mappers.UserMapper;
import souplesse_pilates.studio.souplesse_pilates.services.UserService;

@RestController
@RequestMapping("/admin/instructors")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")

public class InstructorAdminController {
    private final UserService userService;
    private final UserMapper userMapper;
    private final souplesse_pilates.studio.souplesse_pilates.services.AdminLogService adminLogService;

    @PostMapping
    public ResponseEntity<UserResponseDto> createInstructor(
            @Valid @RequestBody UserRequestDto dto) {

        User instructor = userService.createInstructor(dto);
        adminLogService.log("CREATE", "Nouvel instructeur créé: " + instructor.getFirstName() + " " + instructor.getLastName());
        return ResponseEntity.ok(userMapper.toDto(instructor));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDto> updateInstructor(
            @PathVariable Long id,
            @Valid @RequestBody UpdateInstructorRequestDto dto) {

        User updated = userService.updateInstructor(id, dto);
        adminLogService.log("UPDATE", "Instructeur mis à jour: " + updated.getFirstName() + " " + updated.getLastName());
        return ResponseEntity.ok(userMapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInstructor(@PathVariable Long id) {

        userService.deleteInstructor(id);
        adminLogService.log("DELETE", "Instructeur supprimé (ID: " + id + ")");
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAllInstructors() {

        List<UserResponseDto> instructors = userService.findAllUsers().stream()
                .filter(user -> user.getRole().name().equals("INSTRUCTOR"))
                .map(userMapper::toDto)
                .toList();

        return ResponseEntity.ok(instructors);
    }
}