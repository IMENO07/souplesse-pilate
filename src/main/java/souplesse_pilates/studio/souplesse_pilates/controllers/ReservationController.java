package souplesse_pilates.studio.souplesse_pilates.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import souplesse_pilates.studio.souplesse_pilates.domain.dtos.requests.CreateReservationRequestDto;
import souplesse_pilates.studio.souplesse_pilates.domain.dtos.responses.ReservationResponseDto;
import souplesse_pilates.studio.souplesse_pilates.mappers.ReservationMapper;
import souplesse_pilates.studio.souplesse_pilates.services.AdminLogService;
import souplesse_pilates.studio.souplesse_pilates.services.ReservationService;

@RestController
@RequestMapping("/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;
    private final ReservationMapper reservationMapper;
    private final AdminLogService adminLogService;

    @PostMapping
    public ResponseEntity<ReservationResponseDto> book(
            @Valid @RequestBody CreateReservationRequestDto dto) {
        ReservationResponseDto result = reservationMapper.toDto(reservationService.createReservation(dto));
        adminLogService.log("RESERVATION", "Nouvelle réservation: " + result.firstName() + " (" + result.courseType() + ")");
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
}