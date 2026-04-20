package souplesse_pilates.studio.souplesse_pilates.domain.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponseDto {
    private String status;
    private int code;
    private String message;
    private LocalDateTime timestamp;
    private Map<String, String> details;
}
