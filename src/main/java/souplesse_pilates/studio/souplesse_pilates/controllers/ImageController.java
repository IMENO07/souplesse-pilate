package souplesse_pilates.studio.souplesse_pilates.controllers;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.DatabaseImage;
import souplesse_pilates.studio.souplesse_pilates.services.DatabaseImageService;

import java.util.Map;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final DatabaseImageService imageService;

    public ImageController(DatabaseImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        String url = imageService.uploadImage(file);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        DatabaseImage image = imageService.getImage(id);
        
        HttpHeaders headers = new HttpHeaders();
        MediaType mediaType = MediaType.parseMediaType(image.getContentType() != null ? image.getContentType() : "image/jpeg");
        headers.setContentType(mediaType);
        
        return new ResponseEntity<>(image.getData(), headers, HttpStatus.OK);
    }
}
