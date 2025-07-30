package com.bether.bether.room.application.service;

import com.bether.bether.common.NotFoundException;
import com.bether.bether.room.domain.Room;
import com.bether.bether.room.domain.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RoomDomainService {

    private final RoomRepository roomRepository;

    @Transactional(readOnly = true)
    public Room getBySession(final String session) {
        return roomRepository.findBySession(session)
                .orElseThrow(() -> new NotFoundException(Room.class.getSimpleName()));
    }

    @Transactional(readOnly = true)
    public Long getIdBySession(final String session) {
        return getBySession(session).getId(); // TODO 검색 대상 파라미터 명시 여부 논의 필요
    }

    @Transactional
    public Room save(final Room room) {
        return roomRepository.save(room);
    }
}
