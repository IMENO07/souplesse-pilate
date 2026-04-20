package souplesse_pilates.studio.souplesse_pilates.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import souplesse_pilates.studio.souplesse_pilates.domain.dtos.requests.UpdateReservationRequestDto;
import souplesse_pilates.studio.souplesse_pilates.domain.dtos.responses.ReservationResponseDto;
import souplesse_pilates.studio.souplesse_pilates.mappers.ReservationMapper;
import souplesse_pilates.studio.souplesse_pilates.services.ReservationService;

import java.util.List;

@RestController
@RequestMapping("/admin/reservations")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ReservationAdminController {

    private final ReservationService reservationService;
    private final ReservationMapper reservationMapper;
    private final souplesse_pilates.studio.souplesse_pilates.services.AdminLogService adminLogService;

    // View all reservations
    @GetMapping
    public ResponseEntity<List<ReservationResponseDto>> getAll() {
        return ResponseEntity.ok(
            reservationService.getAllReservations()
                .stream()
                .map(reservationMapper::toDto)
                .toList()
        );
    }

    // View reservations for a specific course
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<ReservationResponseDto>> getByCourse(
            @PathVariable Long courseId) {
        return ResponseEntity.ok(
            reservationService.getReservationsByCourse(courseId)
                .stream()
                .map(reservationMapper::toDto)
                .toList()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservationResponseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReservationRequestDto dto) {

        var updated = reservationService.updateReservation(id, dto);
        adminLogService.log("UPDATE", "Réservation (ID: " + id + ") mise à jour.");
        return ResponseEntity.ok(reservationMapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        adminLogService.log("DELETE", "Réservation (ID: " + id + ") supprimée.");
        return ResponseEntity.noContent().build();
    }
}