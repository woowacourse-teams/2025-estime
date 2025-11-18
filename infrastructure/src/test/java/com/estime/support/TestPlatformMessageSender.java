package com.estime.support;

import com.estime.port.out.PlatformMessageSender;
import com.estime.room.RoomSession;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class TestPlatformMessageSender implements PlatformMessageSender {

    private final List<String> sentMessages = new ArrayList<>();

    @Override
    public void sendDeadlineAlertMessage(
            final String channelId,
            final RoomSession session,
            final String title
    ) {
        sentMessages.add("DeadlineAlert: " + channelId + " " + session + " " + title);
    }

    @Override
    public void sendConnectedRoomCreatedMessage(
            final String channelId,
            final RoomSession session,
            final String title,
            final LocalDateTime deadline
    ) {
        sentMessages.add("ConnectedRoomCreated: " + channelId + " " + session + " " + title);
    }

    @Override
    public void sendReminderMessage(
            final String channelId,
            final RoomSession session,
            final String title,
            final LocalDateTime deadline
    ) {
        sentMessages.add("Reminder: " + channelId + " " + session + " " + title);
    }

    public List<String> getSentMessages() {
        return new ArrayList<>(sentMessages);
    }

    public void clear() {
        sentMessages.clear();
    }
}
