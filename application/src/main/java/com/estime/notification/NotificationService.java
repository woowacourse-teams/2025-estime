package com.estime.notification;

import com.estime.exception.NotFoundException;
import com.estime.port.out.PlatformMessageSender;
import com.estime.room.Room;
import com.estime.room.RoomRepository;
import com.estime.room.platform.Platform;
import com.estime.room.platform.PlatformRepository;
import com.estime.shared.DomainTerm;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final RoomRepository roomRepository;
    private final PlatformRepository platformRepository;
    private final PlatformMessageSender platformMessageSender;

    @Transactional(readOnly = true)
    public void sendCreationNotification(final Long roomId) {
        final Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new NotFoundException(DomainTerm.ROOM, roomId));
        final Platform platform = platformRepository.findByRoomId(roomId)
                .orElseThrow(() -> new NotFoundException(DomainTerm.PLATFORM, roomId));

        platformMessageSender.sendConnectedRoomCreatedMessage(
                platform.getChannelId(),
                room.getSession(),
                room.getTitle(),
                room.getDeadline()
        );
    }

    @Transactional(readOnly = true)
    public void sendReminderNotification(final Long roomId) {
        final Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new NotFoundException(DomainTerm.ROOM, roomId));
        final Platform platform = platformRepository.findByRoomId(roomId)
                .orElseThrow(() -> new NotFoundException(DomainTerm.PLATFORM, roomId));

        platformMessageSender.sendReminderMessage(
                platform.getChannelId(),
                room.getSession(),
                room.getTitle(),
                room.getDeadline()
        );
    }

    @Transactional(readOnly = true)
    public void sendDeadlineNotification(final Long roomId) {
        final Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new NotFoundException(DomainTerm.ROOM, roomId));
        final Platform platform = platformRepository.findByRoomId(roomId)
                .orElseThrow(() -> new NotFoundException(DomainTerm.PLATFORM, roomId));

        platformMessageSender.sendDeadlineAlertMessage(
                platform.getChannelId(),
                room.getSession(),
                room.getTitle()
        );
    }
}
