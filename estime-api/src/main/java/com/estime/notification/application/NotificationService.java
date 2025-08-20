package com.estime.notification.application;

import com.estime.room.domain.Room;
import com.estime.room.domain.RoomRepository;
import com.estime.room.domain.platform.Platform;
import com.estime.room.domain.platform.PlatformRepository;
import com.estime.room.infrastructure.platform.discord.DiscordMessageSender;
import java.util.NoSuchElementException;
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
                    .orElseThrow(() -> new NoSuchElementException("Room not found with id: " + roomId));
            final Platform platform = platformRepository.findByRoomId(roomId)
                    .orElseThrow(() -> new NoSuchElementException("Platform not found for room id: " + roomId));

            final String channelId = platform.getChannelId();
            final String roomTitle = room.getTitle();

            discordMessageSender.sendReminderMessage(channelId, roomTitle);
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
                    .orElseThrow(() -> new NoSuchElementException("Room not found with id: " + roomId));
            final Platform platform = platformRepository.findByRoomId(roomId)
                    .orElseThrow(() -> new NoSuchElementException("Platform not found for room id: " + roomId));

            final String channelId = platform.getChannelId();
            final String roomTitle = room.getTitle();

            discordMessageSender.sendDeadlineAlertMessage(channelId, roomTitle);
            log.info("Successfully sent DEADLINE ALERT for room {}", roomId);

        } catch (final Exception e) {
            log.error("Failed to send deadline alert for room: {}", roomId, e);
        }
    }
}
