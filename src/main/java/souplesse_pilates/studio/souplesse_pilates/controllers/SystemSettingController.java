package souplesse_pilates.studio.souplesse_pilates.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import souplesse_pilates.studio.souplesse_pilates.services.SettingService;
import souplesse_pilates.studio.souplesse_pilates.services.EmailService;

import java.util.Map;

@RestController
@RequestMapping("/admin/settings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class SystemSettingController {

    private final SettingService settingService;
    private final EmailService emailService;

    @GetMapping("/email")
    public ResponseEntity<Map<String, String>> getEmailSettings() {
        return ResponseEntity.ok(settingService.getAllEmailSettings());
    }

    @PostMapping("/email")
    public ResponseEntity<Void> updateEmailSettings(@RequestBody Map<String, String> settings) {
        settingService.updateEmailSettings(settings);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/email/test")
    public ResponseEntity<String> sendTestEmail(@RequestParam String targetEmail) {
        try {
            emailService.sendTestEmail(targetEmail);
            return ResponseEntity.ok("Test email sent successfully to " + targetEmail);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
