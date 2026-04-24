package souplesse_pilates.studio.souplesse_pilates.config.seed;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import souplesse_pilates.studio.souplesse_pilates.services.SettingService;

@Slf4j
@Component
@RequiredArgsConstructor
public class SystemSettingSeeder implements CommandLineRunner {

    private final SettingService settingService;

    @Value("${spring.mail.host}")     private String defaultHost;
    @Value("${spring.mail.port}")     private String defaultPort;
    @Value("${spring.mail.username}") private String defaultUser;
    @Value("${spring.mail.password}") private String defaultPass;
    @Value("${app.mail.from}")        private String defaultFrom;
    @Value("${app.mail.studio-name}") private String defaultStudio;

    @Override
    public void run(String... args) {
        log.info("Checking system settings...");
        
        seedIfMissing("MAIL_HOST", defaultHost);
        seedIfMissing("MAIL_PORT", defaultPort);
        seedIfMissing("MAIL_USERNAME", defaultUser);
        seedIfMissing("MAIL_PASSWORD", defaultPass);
        seedIfMissing("MAIL_FROM", defaultFrom);
        seedIfMissing("MAIL_STUDIO_NAME", defaultStudio);
    }

    private void seedIfMissing(String key, String value) {
        if (settingService.getSetting(key, null) == null) {
            log.info("Seeding setting: {} = {}", key, key.contains("PASSWORD") ? "********" : value);
            settingService.updateSetting(key, value);
        }
    }
}
