package souplesse_pilates.studio.souplesse_pilates.services.Impl;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.DatabaseImage;
import souplesse_pilates.studio.souplesse_pilates.repositories.DatabaseImageRepository;
import souplesse_pilates.studio.souplesse_pilates.services.DatabaseImageService;

import java.io.IOException;

@Service
public class DatabaseImageServiceImpl implements DatabaseImageService {

    private final DatabaseImageRepository repository;

    public DatabaseImageServiceImpl(DatabaseImageRepository repository) {
        this.repository = repository;
    }

    @Override
    public String uploadImage(MultipartFile file) {
        try {
            DatabaseImage image = DatabaseImage.builder()
                    .data(file.getBytes())
                    .contentType(file.getContentType())
                    .filename(file.getOriginalFilename())
                    .build();
            
            image = repository.save(image);
            return "/api/images/" + image.getId();
        } catch (IOException e) {
            throw new RuntimeException("Failed to store image data", e);
        }
    }

    @Override
    public DatabaseImage getImage(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Image not found with id " + id));
    }
}
