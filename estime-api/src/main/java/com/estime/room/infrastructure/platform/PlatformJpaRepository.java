package com.estime.room.infrastructure.platform;

import com.estime.room.domain.platform.Platform;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlatformJpaRepository extends JpaRepository<Platform, Long> {
}
