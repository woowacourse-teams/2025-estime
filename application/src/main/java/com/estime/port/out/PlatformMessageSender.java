package com.estime.port.out;

import com.estime.room.RoomSession;
import java.time.LocalDateTime;

public interface PlatformMessageSender {

    void sendConnectedRoomCreatedMessage(String channelId, RoomSession session, String title, LocalDateTime deadline);

    void sendReminderMessage(String channelId, RoomSession session, String title, LocalDateTime deadline);

    void sendDeadlineAlertMessage(String channelId, RoomSession session, String title);
}
