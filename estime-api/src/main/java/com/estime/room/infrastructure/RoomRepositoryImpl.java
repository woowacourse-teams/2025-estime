package com.estime.room.infrastructure;

import com.estime.room.domain.Room;
import com.estime.room.domain.RoomRepository;
import com.estime.room.domain.vo.RoomSession;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RoomRepositoryImpl implements RoomRepository {

    private final RoomJpaRepository roomJpaRepository;

    @Override
    public Room save(final Room room) {
        return roomJpaRepository.save(room);
    }

    @Override
    public Optional<Room> findBySession(final RoomSession session) {
        return roomJpaRepository.findBySessionAndActiveTrue(session);
    }

    @Override
    public Optional<Long> findIdBySession(final RoomSession session) {
        return findBySession(session).map(Room::getId);
    }

    @Override
    public Optional<Room> findById(final Long id) {
        return roomJpaRepository.findByIdAndActiveTrue(id);
    }

    @Override
    public List<Room> findAllByIdGreaterThanOrderByIdAsc(final Long id) {
        return roomJpaRepository.findAllByIdGreaterThanAndActiveTrueOrderByIdAsc(id);
    }

    @Override
    public List<Room> findAllByDeadlineAfter(final LocalDateTime criterion) {
        return roomJpaRepository.findAllByDeadlineAfterAndActiveTrue(criterion);
    }
}
