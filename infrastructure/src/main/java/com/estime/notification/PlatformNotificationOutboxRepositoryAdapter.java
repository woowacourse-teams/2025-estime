package com.estime.notification;

import com.estime.outbox.OutboxStatus;
import com.estime.room.platform.notification.PlatformNotificationOutbox;
import com.estime.room.platform.notification.PlatformNotificationOutboxRepository;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.LockModeType;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class PlatformNotificationOutboxRepositoryAdapter implements PlatformNotificationOutboxRepository {

    private static final QPlatformNotificationOutbox outbox = QPlatformNotificationOutbox.platformNotificationOutbox;

    private final NotificationOutboxJpaRepository jpaRepository;
    private final JPAQueryFactory queryFactory;

    @Override
    public PlatformNotificationOutbox save(final PlatformNotificationOutbox outbox) {
        return jpaRepository.save(outbox);
    }

    @Override
    public Optional<PlatformNotificationOutbox> find(final Long id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<PlatformNotificationOutbox> findDuePendingForUpdate(
            final Instant now,
            final int limit
    ) {
        return queryFactory.selectFrom(outbox)
                .where(
                        outbox.status.eq(OutboxStatus.PENDING),
                        outbox.scheduledAt.loe(now)
                )
                .orderBy(outbox.scheduledAt.asc())
                .limit(limit)
                .setLockMode(LockModeType.PESSIMISTIC_WRITE)
                .fetch();
    }
}
