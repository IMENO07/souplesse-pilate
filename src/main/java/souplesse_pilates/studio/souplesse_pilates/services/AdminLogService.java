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
    private final List<AdminLog> archivedLogs = Collections.synchronizedList(new ArrayList<>());
    private static final int MAX_RECENT = 100;
    private static final int MAX_ARCHIVE = 1000;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public void log(String type, String message) {
        String timestamp = LocalDateTime.now().format(formatter);
        AdminLog newLog = new AdminLog(timestamp, type.toUpperCase(), message);
        
        logs.add(0, newLog);
        if (logs.size() > MAX_RECENT) {
            logs.remove(logs.size() - 1);
        }
        
        archivedLogs.add(0, newLog);
        if (archivedLogs.size() > MAX_ARCHIVE) {
            archivedLogs.remove(archivedLogs.size() - 1);
        }
    }

    public List<AdminLog> getRecentLogs() {
        return new ArrayList<>(logs);
    }

    public List<AdminLog> getArchivedLogs() {
        return new ArrayList<>(archivedLogs);
    }
}
