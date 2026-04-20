package souplesse_pilates.studio.souplesse_pilates.services;

import org.springframework.web.multipart.MultipartFile;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.DatabaseImage;

public interface DatabaseImageService {
    String uploadImage(MultipartFile file);
    DatabaseImage getImage(Long id);
}
