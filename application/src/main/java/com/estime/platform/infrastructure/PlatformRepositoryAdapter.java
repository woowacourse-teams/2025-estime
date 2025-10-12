package com.estime.platform.infrastructure;

import com.estime.room.platform.Platform;
import com.estime.room.platform.PlatformRepository;
import com.estime.room.platform.QPlatform;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class PlatformRepositoryAdapter implements PlatformRepository {

    private static final QPlatform platform = QPlatform.platform;
    private final PlatformJpaRepository jpaRepository;
    private final JPAQueryFactory queryFactory;

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
