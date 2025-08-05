package com.estime.connection.infrastructure;

import com.estime.connection.domain.ConnectedRoom;
import com.estime.connection.domain.ConnectedRoomRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ConnectedRoomRepositoryImpl implements ConnectedRoomRepository {

    private final ConnectedRoomJpaRepository jpaRepository;

    @Override
    public ConnectedRoom save(final ConnectedRoom connectedRoom) {
        return jpaRepository.save(connectedRoom);
    }

    @Override
    public Optional<ConnectedRoom> findBySession(final String session) {
        return jpaRepository.findByRoomSession(session);
    }
}
