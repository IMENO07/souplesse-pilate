package souplesse_pilates.studio.souplesse_pilates.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import souplesse_pilates.studio.souplesse_pilates.domain.entities.SystemSetting;

import java.util.Optional;

@Repository
public interface SystemSettingRepository extends JpaRepository<SystemSetting, String> {
    Optional<SystemSetting> findByKey(String key);
}
