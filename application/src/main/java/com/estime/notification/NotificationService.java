package com.estime.notification;

import com.estime.shared.DomainTerm;
import com.estime.exception.NotFoundException;
import com.estime.room.Room;
import com.estime.room.RoomRepository;
import com.estime.room.platform.Platform;
import com.estime.room.platform.PlatformRepository;
import com.estime.room.platform.discord.DiscordMessageSender;
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
    private final DiscordMessageSender discordMessageSender;

    @Transactional(readOnly = true)
    public void sendReminderNotification(final Long roomId) {
        log.info("Preparing REMINDER notification for room: {}", roomId);
        try {
            final Room room = roomRepository.findById(roomId)
                    .orElseThrow(() -> new NotFoundException(DomainTerm.ROOM, roomId));
            final Platform platform = platformRepository.findByRoomId(roomId)
                    .orElseThrow(() -> new NotFoundException(DomainTerm.PLATFORM, roomId));

            discordMessageSender.sendReminderMessage(
                    platform.getChannelId(),
                    room.getSession(),
                    room.getTitle(),
                    room.getDeadline()
            );
            log.info("Successfully sent REMINDER for room {}", roomId);

        } catch (final Exception e) {
            log.error("Failed to send reminder for room: {}", roomId, e);
        }
    }

    @Transactional(readOnly = true)
    public void sendDeadlineAlert(final Long roomId) {
        log.info("Preparing DEADLINE ALERT for room: {}", roomId);
        try {
            final Room room = roomRepository.findById(roomId)
                    .orElseThrow(() -> new NotFoundException(DomainTerm.ROOM, roomId));
            final Platform platform = platformRepository.findByRoomId(roomId)
                    .orElseThrow(() -> new NotFoundException(DomainTerm.PLATFORM, roomId));

            discordMessageSender.sendDeadlineAlertMessage(
                    platform.getChannelId(),
                    room.getSession(),
                    room.getTitle()
            );
            log.info("Successfully sent DEADLINE ALERT for room {}", roomId);

        } catch (final Exception e) {
            log.error("Failed to send deadline alert for room: {}", roomId, e);
        }
    }
}
