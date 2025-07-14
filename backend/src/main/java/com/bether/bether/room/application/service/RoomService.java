package com.bether.bether.room.application.service;

import com.bether.bether.room.application.dto.RoomInput;
import com.bether.bether.room.application.dto.RoomOutput;
import com.bether.bether.room.domain.Room;
import com.bether.bether.room.domain.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    @Transactional
    public RoomOutput save(final RoomInput input) {
        final Room room = input.toEntity();
        final Room saved = roomRepository.save(room);
        return RoomOutput.from(saved);
    }
}
