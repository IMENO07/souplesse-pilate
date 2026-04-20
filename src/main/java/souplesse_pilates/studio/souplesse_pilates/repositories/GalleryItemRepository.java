package souplesse_pilates.studio.souplesse_pilates.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.GalleryItem;

@Repository
public interface GalleryItemRepository extends JpaRepository<GalleryItem, Long> {
}
