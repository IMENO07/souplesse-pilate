package souplesse_pilates.studio.souplesse_pilates.domain.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminLog {
    private String timestamp;
    private String type;
    private String message;
}
