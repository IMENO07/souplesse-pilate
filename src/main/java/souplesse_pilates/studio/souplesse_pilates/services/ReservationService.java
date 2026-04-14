package souplesse_pilates.studio.souplesse_pilates.services;

import souplesse_pilates.studio.souplesse_pilates.domain.dtos.requests.CreateReservationRequestDto;
import souplesse_pilates.studio.souplesse_pilates.domain.dtos.requests.UpdateReservationRequestDto;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.Reservation;

import java.util.List;

public interface ReservationService {
    Reservation createReservation(CreateReservationRequestDto dto);
    List<Reservation> getReservationsByCourse(Long courseId);
    List<Reservation> getAllReservations();

    Reservation updateReservation(Long id, UpdateReservationRequestDto dto);
    void deleteReservation(Long id);
}