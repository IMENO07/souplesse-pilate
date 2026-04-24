package souplesse_pilates.studio.souplesse_pilates.services.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.SystemSetting;
import souplesse_pilates.studio.souplesse_pilates.repositories.SystemSettingRepository;
import souplesse_pilates.studio.souplesse_pilates.services.SettingService;

import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SettingServiceImpl implements SettingService {

    private final SystemSettingRepository repository;

    @Override
    public String getSetting(String key, String defaultValue) {
        return repository.findById(key)
                .map(SystemSetting::getValue)
                .orElse(defaultValue);
    }

    @Override
    @Transactional
    public void updateSetting(String key, String value) {
        SystemSetting setting = repository.findById(key)
                .orElse(SystemSetting.builder().key(key).build());
        setting.setValue(value);
        repository.save(setting);
    }

    @Override
    public Map<String, String> getAllEmailSettings() {
        return repository.findAll().stream()
                .filter(s -> s.getKey().startsWith("MAIL_"))
                .collect(Collectors.toMap(SystemSetting::getKey, SystemSetting::getValue));
    }

    @Override
    @Transactional
    public void updateEmailSettings(Map<String, String> settings) {
        settings.forEach(this::updateSetting);
    }
}
