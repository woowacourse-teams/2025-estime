package com.estime.room.infrastructure.platform;

import com.estime.room.domain.platform.Platform;
import com.estime.room.domain.platform.PlatformRepository;
import com.estime.room.domain.platform.QPlatform;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class PlatformRepositoryImpl implements PlatformRepository {

    private final PlatformJpaRepository jpaRepository;
    private final JPAQueryFactory queryFactory;

    private static final QPlatform platform = QPlatform.platform;

    @Override
    public Platform save(final Platform platform) {
        return jpaRepository.save(platform);
    }

    @Override
    public Optional<Platform> findByRoomId(final Long roomId) {
        return Optional.ofNullable(
                queryFactory.selectFrom(platform)
                        .where(platform.roomId.eq(roomId))
                        .fetchOne()
        );
    }
}
