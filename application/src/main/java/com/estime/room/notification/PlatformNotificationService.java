package com.estime.room.notification;

import com.estime.exception.NotFoundException;
import com.estime.port.out.PlatformMessageSender;
import com.estime.room.Room;
import com.estime.room.RoomRepository;
import com.estime.room.platform.Platform;
import com.estime.room.platform.PlatformRepository;
import com.estime.room.platform.PlatformType;
import com.estime.room.platform.notification.PlatformNotificationType;
import com.estime.shared.DomainTerm;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlatformNotificationService {

    private final RoomRepository roomRepository;
    private final PlatformRepository platformRepository;
    private final Map<PlatformType, PlatformMessageSender> platformMessageSenders;

    public void sendNotification(
            final Long roomId,
            final PlatformNotificationType type
    ) {
        final Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new NotFoundException(DomainTerm.ROOM, roomId));
        final Platform platform = platformRepository.findByRoomId(roomId)
                .orElseThrow(() -> new NotFoundException(DomainTerm.PLATFORM, roomId));

        final PlatformMessageSender sender = platformMessageSenders.get(platform.getType());

        switch (type) {
            case CREATION -> sender.sendConnectedRoomCreatedMessage(
                    platform.getChannelId(),
                    room.getSession(),
                    room.getTitle(),
                    room.getDeadline()
            );
            case REMINDER -> sender.sendReminderMessage(
                    platform.getChannelId(),
                    room.getSession(),
                    room.getTitle(),
                    room.getDeadline()
            );
            case DEADLINE -> sender.sendDeadlineAlertMessage(
                    platform.getChannelId(),
                    room.getSession(),
                    room.getTitle()
            );
        }
    }
}
