package com.estime.estime.connection.application;

import com.estime.estime.connection.domain.ConnectedRoom;
import com.estime.estime.connection.domain.ConnectedRoomRepository;
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
