package com.estime.port.out;

import com.estime.room.RoomSession;
import com.estime.room.platform.PlatformType;
import java.time.LocalDateTime;

public interface PlatformMessageSender {

    PlatformType getPlatformType();

    void sendDeadlineAlertMessage(
            String channelId,
            RoomSession session,
            String title
    );

    void sendConnectedRoomCreatedMessage(
            String channelId,
            RoomSession session,
            String title,
            LocalDateTime deadline
    );

    void sendReminderMessage(
            String channelId,
            RoomSession session,
            String title,
            LocalDateTime deadline
    );
}
