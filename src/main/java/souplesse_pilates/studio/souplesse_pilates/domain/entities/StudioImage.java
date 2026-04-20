package souplesse_pilates.studio.souplesse_pilates.domain.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "studio_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudioImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "display_order")
    private Integer displayOrder;
}
