package souplesse_pilates.studio.souplesse_pilates.services;

import java.util.Map;

public interface SettingService {
    String getSetting(String key, String defaultValue);
    void updateSetting(String key, String value);
    Map<String, String> getAllEmailSettings();
    void updateEmailSettings(Map<String, String> settings);
}
