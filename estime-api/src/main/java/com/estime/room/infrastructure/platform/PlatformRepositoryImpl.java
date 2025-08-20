package com.estime.room.infrastructure.platform;

import com.estime.room.domain.platform.Platform;
import com.estime.room.domain.platform.PlatformRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class PlatformRepositoryImpl implements PlatformRepository {

    private final PlatformJpaRepository jpaRepository;

    @Override
    public Platform save(final Platform platform) {
        return jpaRepository.save(platform);
    }

    @Override
    public Optional<Platform> findByRoomId(final Long roomId) {
        return jpaRepository.findByRoomId(roomId);
    }
}
