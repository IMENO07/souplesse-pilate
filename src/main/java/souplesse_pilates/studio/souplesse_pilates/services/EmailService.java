package souplesse_pilates.studio.souplesse_pilates.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.Reservation;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromAddress;

    // Confirmation email sent to the client
    public void sendClientConfirmation(Reservation reservation) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(reservation.getEmail());
        message.setSubject("Booking Confirmed — " + reservation.getCourse().getType());
        message.setText(
            "Hello " + reservation.getFirstName() + ",\n\n" +
            "Your booking has been confirmed for the following class:\n\n" +
            "  Type      : " + reservation.getCourse().getType() + "\n" +
            "  Date      : " + reservation.getCourse().getDate() + "\n" +
            "  Time      : " + reservation.getCourse().getTime() + "\n" +
            "  Instructor: " + reservation.getCourse().getInstructor().getFirstName()
                            + " " + reservation.getCourse().getInstructor().getLastName() + "\n\n" +
            "See you there!\n\n" +
            "— The Studio Team"
        );
        mailSender.send(message);
    }

    // Notification email sent to the instructor
    public void sendInstructorNotification(Reservation reservation) {
        String instructorEmail = reservation.getCourse().getInstructor().getEmail();

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(instructorEmail);
        message.setSubject("New Booking — " + reservation.getCourse().getType()
                            + " on " + reservation.getCourse().getDate());
        message.setText(
            "Hello " + reservation.getCourse().getInstructor().getFirstName() + ",\n\n" +
            "A new student has booked your class:\n\n" +
            "  Name : " + reservation.getFirstName() + " " + reservation.getLastName() + "\n" +
            "  Email: " + reservation.getEmail() + "\n\n" +
            "  Class : " + reservation.getCourse().getType() + "\n" +
            "  Date  : " + reservation.getCourse().getDate() + "\n" +
            "  Time  : " + reservation.getCourse().getTime() + "\n\n" +
            "— The Studio Team"
        );
        mailSender.send(message);
    }
}