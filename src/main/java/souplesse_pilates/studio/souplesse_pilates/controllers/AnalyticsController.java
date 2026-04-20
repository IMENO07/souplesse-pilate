package souplesse_pilates.studio.souplesse_pilates.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.Course;
import souplesse_pilates.studio.souplesse_pilates.repositories.CourseRepository;
import souplesse_pilates.studio.souplesse_pilates.repositories.ReservationRepository;

import java.time.DayOfWeek;
import java.time.format.TextStyle;
import java.util.*;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {

    private final CourseRepository courseRepository;
    private final ReservationRepository reservationRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        List<Course> courses = courseRepository.findAll();

        // ── Actual reservation count per course (bypass reservedSpots field) ─────
        // Course @PrePersist resets reservedSpots=0, so we count real records
        Map<Long, Long> reservationCountByCourse = new HashMap<>();
        for (Course c : courses) {
            long count = reservationRepository.findByCourseId(c.getId()).size();
            reservationCountByCourse.put(c.getId(), count);
        }

        // ── Reservations by Day of Week (from actual reservation records) ─────────
        Map<DayOfWeek, Long> byDay = new LinkedHashMap<>();
        for (DayOfWeek d : DayOfWeek.values()) byDay.put(d, 0L);

        for (Course c : courses) {
            if (c.getDate() != null) {
                DayOfWeek dow = c.getDate().getDayOfWeek();
                long count = reservationCountByCourse.getOrDefault(c.getId(), 0L);
                byDay.merge(dow, count, Long::sum);
            }
        }

        List<Map<String, Object>> reservationsByDay = new ArrayList<>();
        for (Map.Entry<DayOfWeek, Long> e : byDay.entrySet()) {
            String label = e.getKey().getDisplayName(TextStyle.SHORT, Locale.FRENCH);
            label = label.substring(0, 1).toUpperCase() + label.substring(1, Math.min(3, label.length()));
            Map<String, Object> pt = new LinkedHashMap<>();
            pt.put("name", label);
            pt.put("val", e.getValue());
            reservationsByDay.add(pt);
        }

        // ── Per-course capacity vs actual reservations ────────────────────────────
        List<Map<String, Object>> courseCapacity = new ArrayList<>();
        for (Course c : courses) {
            long actual   = reservationCountByCourse.getOrDefault(c.getId(), 0L);
            long capacity = c.getCapacity() != null ? c.getCapacity() : 0;
            Map<String, Object> pt = new LinkedHashMap<>();
            String name = c.getTitle() != null ? c.getTitle() : c.getType().name();
            pt.put("name", name.length() > 12 ? name.substring(0, 12) : name);
            pt.put("reserved",  actual);
            pt.put("remaining", Math.max(0, capacity - actual));
            courseCapacity.add(pt);
        }

        // ── Summary ───────────────────────────────────────────────────────────────
        long totalReservations = reservationCountByCourse.values().stream().mapToLong(Long::longValue).sum();
        long totalCapacity     = courses.stream().mapToLong(c -> c.getCapacity() != null ? c.getCapacity() : 0).sum();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("reservationsByDay", reservationsByDay);
        result.put("courseCapacity",    courseCapacity);
        result.put("totalCourses",      courses.size());
        result.put("totalReservations", totalReservations);
        result.put("totalCapacity",     totalCapacity);

        return ResponseEntity.ok(result);
    }
}
