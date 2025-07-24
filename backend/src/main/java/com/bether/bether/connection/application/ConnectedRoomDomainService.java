package com.bether.bether.connection.application;

import com.bether.bether.connection.domain.ConnectedRoom;
import com.bether.bether.connection.domain.ConnectedRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConnectedRoomDomainService {

    private final ConnectedRoomRepository connectedRoomRepository;

    public ConnectedRoom save(final ConnectedRoom connectedRoom) {
        return connectedRoomRepository.save(connectedRoom);
    }
}
