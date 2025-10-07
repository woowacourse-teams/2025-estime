package com.estime.platform;

import com.estime.room.platform.Platform;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlatformJpaRepository extends JpaRepository<Platform, Long> {
}
