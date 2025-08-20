package com.estime.room.infrastructure.platform;

import com.estime.room.domain.platform.Platform;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlatformJpaRepository extends JpaRepository<Platform, Long> {

    Optional<Platform> findByRoomIdAndActiveTrue(Long roomId);
}
