package souplesse_pilates.studio.souplesse_pilates.services;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.springframework.stereotype.Service;
import souplesse_pilates.studio.souplesse_pilates.domain.models.AdminLog;

@Service
public class AdminLogService {
    private final List<AdminLog> logs = Collections.synchronizedList(new ArrayList<>());
    private static final int MAX_LOGS = 100;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");

    public void log(String type, String message) {
        String timestamp = LocalDateTime.now().format(formatter);
        logs.add(0, new AdminLog(timestamp, type.toUpperCase(), message));
        if (logs.size() > MAX_LOGS) {
            logs.remove(logs.size() - 1);
        }
    }

    public List<AdminLog> getRecentLogs() {
        return new ArrayList<>(logs);
    }
}
