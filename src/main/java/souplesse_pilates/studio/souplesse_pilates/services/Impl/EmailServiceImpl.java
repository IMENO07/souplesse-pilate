package souplesse_pilates.studio.souplesse_pilates.services.Impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.Reservation;
import souplesse_pilates.studio.souplesse_pilates.services.EmailService;
import souplesse_pilates.studio.souplesse_pilates.services.SettingService;

import java.util.Properties;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final SpringTemplateEngine templateEngine;
    private final SettingService settingService;

    // Default fallbacks from application.yaml if DB is empty
    @Value("${spring.mail.host}")     private String defaultHost;
    @Value("${spring.mail.port}")     private int    defaultPort;
    @Value("${spring.mail.username}") private String defaultUser;
    @Value("${spring.mail.password}") private String defaultPass;
    @Value("${app.mail.from}")        private String defaultFrom;
    @Value("${app.mail.studio-name}") private String defaultStudio;

    // ─── Client Confirmation ───────────────────────────────────────────────────

    @Async("emailExecutor")
    @Override
    public void sendClientConfirmation(Reservation reservation) {
        try {
            String studioName = settingService.getSetting("MAIL_STUDIO_NAME", defaultStudio);

            Context ctx = new Context();
            ctx.setVariable("studioName",      studioName);
            ctx.setVariable("firstName",       reservation.getFirstName());
            ctx.setVariable("courseType",      reservation.getCourse().getType().name());
            ctx.setVariable("courseDate",      reservation.getCourse().getDate().toString());
            ctx.setVariable("courseTime",      reservation.getCourse().getTime().toString());
            ctx.setVariable("instructorName",
                reservation.getCourse().getInstructor().getFirstName() + " " +
                reservation.getCourse().getInstructor().getLastName());
            ctx.setVariable("availableSpots",  reservation.getCourse().getAvailableSpots());

            String html = templateEngine.process("emails/client-confirmation", ctx);

            sendHtmlEmail(
                reservation.getEmail(),
                "Booking Confirmation — " + reservation.getCourse().getType().name(),
                html
            );

            log.info("Confirmation email sent to {}", reservation.getEmail());

        } catch (Exception e) {
            log.error("Failed to send confirmation email to {} — {}",
                reservation.getEmail(), e.getMessage());
        }
    }

    // ─── Instructor Notification ───────────────────────────────────────────────

    @Async("emailExecutor")
    @Override
    public void sendInstructorNotification(Reservation reservation) {
        try {
            String studioName = settingService.getSetting("MAIL_STUDIO_NAME", defaultStudio);
            String instructorEmail = reservation.getCourse().getInstructor().getEmail();

            Context ctx = new Context();
            ctx.setVariable("studioName",         studioName);
            ctx.setVariable("instructorFirstName", reservation.getCourse().getInstructor().getFirstName());
            ctx.setVariable("clientName",
                reservation.getFirstName() + " " + reservation.getLastName());
            ctx.setVariable("clientEmail",        reservation.getEmail());
            ctx.setVariable("courseType",         reservation.getCourse().getType().name());
            ctx.setVariable("courseDate",         reservation.getCourse().getDate().toString());
            ctx.setVariable("courseTime",         reservation.getCourse().getTime().toString());
            ctx.setVariable("availableSpots",     reservation.getCourse().getAvailableSpots());

            String html = templateEngine.process("emails/instructor-notification", ctx);

            sendHtmlEmail(
                instructorEmail,
                "New Booking Received — " + reservation.getCourse().getType().name(),
                html
            );

            log.info("Notification email sent to instructor {}", instructorEmail);

        } catch (Exception e) {
            log.error("Failed to send notification email to instructor — {}",
                e.getMessage());
        }
    }

    @Override
    public void sendTestEmail(String toEmail) {
        try {
            sendHtmlEmail(
                toEmail,
                "Test Email — " + settingService.getSetting("MAIL_STUDIO_NAME", defaultStudio),
                "<p>This is a test email to verify your SMTP configuration.</p><p>If you received this, your email settings are working correctly!</p>"
            );
            log.info("Test email sent successfully to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send test email to {} — {}", toEmail, e.getMessage());
            throw new RuntimeException("Email test failed: " + e.getMessage());
        }
    }

    // ─── Shared HTML sender ────────────────────────────────────────────────────

    private void sendHtmlEmail(String to, String subject, String htmlBody)
            throws MessagingException {
        
        JavaMailSenderImpl mailSender = createDynamicMailSender();
        String fromAddress = settingService.getSetting("MAIL_FROM", defaultFrom);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(fromAddress);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true); // true = HTML
        mailSender.send(message);
    }

    private JavaMailSenderImpl createDynamicMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        
        mailSender.setHost(settingService.getSetting("MAIL_HOST", defaultHost));
        mailSender.setPort(Integer.parseInt(settingService.getSetting("MAIL_PORT", String.valueOf(defaultPort))));
        mailSender.setUsername(settingService.getSetting("MAIL_USERNAME", defaultUser));
        mailSender.setPassword(settingService.getSetting("MAIL_PASSWORD", defaultPass));

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "false");

        return mailSender;
    }
}