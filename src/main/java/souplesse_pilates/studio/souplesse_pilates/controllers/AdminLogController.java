package souplesse_pilates.studio.souplesse_pilates.controllers;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import souplesse_pilates.studio.souplesse_pilates.domain.models.AdminLog;
import souplesse_pilates.studio.souplesse_pilates.services.AdminLogService;

@RestController
@RequestMapping("/api/admin/logs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminLogController {
    private final AdminLogService adminLogService;

    @GetMapping
    public ResponseEntity<List<AdminLog>> getLogs() {
        return ResponseEntity.ok(adminLogService.getRecentLogs());
    }

    @GetMapping("/archive")
    public ResponseEntity<List<AdminLog>> getArchive() {
        return ResponseEntity.ok(adminLogService.getArchivedLogs());
    }
}
