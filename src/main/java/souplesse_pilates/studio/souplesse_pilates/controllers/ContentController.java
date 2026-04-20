package souplesse_pilates.studio.souplesse_pilates.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.GalleryItem;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.StudioImage;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.Testimonial;
import souplesse_pilates.studio.souplesse_pilates.repositories.GalleryItemRepository;
import souplesse_pilates.studio.souplesse_pilates.repositories.StudioImageRepository;
import souplesse_pilates.studio.souplesse_pilates.repositories.TestimonialRepository;

import java.util.List;

@RestController
@RequestMapping("/api/content")
public class ContentController {

    private final GalleryItemRepository galleryRepo;
    private final StudioImageRepository studioImageRepo;
    private final TestimonialRepository testimonialRepo;

    public ContentController(GalleryItemRepository galleryRepo, StudioImageRepository studioImageRepo, TestimonialRepository testimonialRepo) {
        this.galleryRepo = galleryRepo;
        this.studioImageRepo = studioImageRepo;
        this.testimonialRepo = testimonialRepo;
    }

    // --- Studio Images ---
    @GetMapping("/studio-images")
    public ResponseEntity<List<StudioImage>> getStudioImages() {
        return ResponseEntity.ok(studioImageRepo.findAll());
    }

    @PostMapping("/studio-images")
    public ResponseEntity<StudioImage> createStudioImage(@RequestBody StudioImage image) {
        return ResponseEntity.ok(studioImageRepo.save(image));
    }

    @DeleteMapping("/studio-images/{id}")
    public ResponseEntity<Void> deleteStudioImage(@PathVariable Long id) {
        studioImageRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Gallery ---
    @GetMapping("/gallery")
    public ResponseEntity<List<GalleryItem>> getGallery() {
        return ResponseEntity.ok(galleryRepo.findAll());
    }

    @PostMapping("/gallery")
    public ResponseEntity<GalleryItem> createGalleryItem(@RequestBody GalleryItem item) {
        return ResponseEntity.ok(galleryRepo.save(item));
    }

    @DeleteMapping("/gallery/{id}")
    public ResponseEntity<Void> deleteGalleryItem(@PathVariable Long id) {
        galleryRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Testimonials ---
    @GetMapping("/testimonials")
    public ResponseEntity<List<Testimonial>> getTestimonials() {
        return ResponseEntity.ok(testimonialRepo.findAll());
    }

    @PostMapping("/testimonials")
    public ResponseEntity<Testimonial> createTestimonial(@RequestBody Testimonial testimonial) {
        return ResponseEntity.ok(testimonialRepo.save(testimonial));
    }

    @DeleteMapping("/testimonials/{id}")
    public ResponseEntity<Void> deleteTestimonial(@PathVariable Long id) {
        testimonialRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
