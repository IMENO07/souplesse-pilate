package souplesse_pilates.studio.souplesse_pilates.domain.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "system_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemSetting {

    @Id
    @Column(name = "setting_key", nullable = false, unique = true)
    private String key;

    @Column(name = "setting_value", length = 1024)
    private String value;

    @Column(name = "description")
    private String description;
}
