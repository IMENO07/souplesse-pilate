package souplesse_pilates.studio.souplesse_pilates.domain.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "gallery_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GalleryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "caption")
    private String caption;

    @Column(name = "likes")
    @Builder.Default
    private Integer likes = 0;

    @Column(name = "featured")
    @Builder.Default
    private Boolean featured = false;

    @Column(name = "display_order")
    private Integer displayOrder;
}
