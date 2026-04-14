package souplesse_pilates.studio.souplesse_pilates.services;

import souplesse_pilates.studio.souplesse_pilates.domain.entities.Reservation;

public interface EmailService {
    void sendClientConfirmation(Reservation reservation);
    void sendInstructorNotification(Reservation reservation);
}