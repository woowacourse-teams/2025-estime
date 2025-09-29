package com.estime.platform.infrastructure;

import com.estime.domain.room.platform.Platform;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlatformJpaRepository extends JpaRepository<Platform, Long> {
}
