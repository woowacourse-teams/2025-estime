package com.estime.port.out;

import com.estime.room.RoomSession;
import java.time.LocalDateTime;

public interface PlatformMessageSender {

    void sendDeadlineAlertMessage(
            final String channelId,
            final RoomSession session,
            final String title
    );

    void sendTextMessage(final String channelId, final String message);

    void sendConnectedRoomCreatedMessage(
            final String channelId,
            final RoomSession session,
            final String title,
            final LocalDateTime deadline
    );

    void sendReminderMessage(
            final String channelId,
            final RoomSession session,
            final String title,
            final LocalDateTime deadline
    );
}
