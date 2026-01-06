package com.estime.port.out;

import com.estime.room.RoomSession;
import com.estime.room.platform.PlatformType;
import com.estime.room.platform.notification.PlatformNotificationType;
import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;

public interface PlatformMessageSender {

    PlatformType getPlatformType();

    CompletableFuture<Void> send(
            PlatformNotificationType platformNotificationType,
            String channelId,
            RoomSession session,
            String title,
            LocalDateTime deadline
    );
}
