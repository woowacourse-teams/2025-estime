package com.estime.timepreference.infrastructure.category;

import com.estime.timepreference.domain.category.QRoomCategory;
import com.estime.timepreference.domain.category.RoomCategory;
import com.estime.timepreference.domain.category.RoomCategoryRepository;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RoomCategoryRepositoryImpl implements RoomCategoryRepository {

    private final RoomCategoryJpaRepository roomCategoryJpaRepository;
    private final JPAQueryFactory queryFactory;
    private final QRoomCategory roomCategory = QRoomCategory.roomCategory;

    @Override
    public RoomCategory save(final RoomCategory category) {
        return roomCategoryJpaRepository.save(category);
    }

    @Override
    public List<RoomCategory> saveAll(final List<RoomCategory> categories) {
        return roomCategoryJpaRepository.saveAll(categories);
    }

    @Override
    public Optional<RoomCategory> findByRoomId(final Long roomId) {
        return roomCategoryJpaRepository.findByRoomId(roomId);
    }

    @Override
    public List<RoomCategory> findAllInRoomId(final Collection<Long> roomIds) {
        return queryFactory
                .selectFrom(roomCategory)
                .where(roomCategory.roomId.in(roomIds))
                .fetch();
    }
}
