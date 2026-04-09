package souplesse_pilates.studio.souplesse_pilates.repositories;

import souplesse_pilates.studio.souplesse_pilates.domain.entities.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    
}
