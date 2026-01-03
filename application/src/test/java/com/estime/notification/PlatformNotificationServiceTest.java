package com.estime.notification;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import com.estime.port.out.PlatformMessageSender;
import com.estime.room.Room;
import com.estime.room.RoomRepository;
import com.estime.room.RoomSession;
import com.estime.room.notification.PlatformNotificationService;
import com.estime.room.platform.Platform;
import com.estime.room.platform.notification.PlatformNotification;
import com.estime.room.platform.notification.PlatformNotificationType;
import com.estime.room.platform.PlatformRepository;
import com.estime.room.platform.PlatformType;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PlatformNotificationServiceTest {

    private final Long roomId = 1L;
    @Mock
    private RoomRepository roomRepository;
    @Mock
    private PlatformRepository platformRepository;
    @Mock
    private PlatformMessageSender platformMessageSender;
    @InjectMocks
    private PlatformNotificationService platformNotificationService;
    private Room room;
    private Platform platform;

    @BeforeEach
    void setUp() {
        final RoomSession session = RoomSession.from("test-session");
        final LocalDateTime deadline = LocalDateTime.now().plusDays(7);
        room = Room.withoutId("Test Room", session, deadline);

        final PlatformNotification notification = PlatformNotification.of(true, true, true);
        platform = Platform.withoutId(
                roomId,
                PlatformType.DISCORD,
                "test-channel-id",
                notification
        );
    }

    @DisplayName("sendNotification(REMINDER) - 리마인더 알림을 전송한다")
    @Test
    void sendNotification_reminder() {
        // given
        given(roomRepository.findById(roomId)).willReturn(Optional.of(room));
        given(platformRepository.findByRoomId(roomId)).willReturn(Optional.of(platform));

        // when
        platformNotificationService.sendNotification(roomId, PlatformNotificationType.REMINDER);

        // then
        then(platformMessageSender).should().sendReminderMessage(
                eq("test-channel-id"),
                eq(room.getSession()),
                eq("Test Room"),
                eq(room.getDeadline())
        );
        then(platformMessageSender).shouldHaveNoMoreInteractions();
    }

    @DisplayName("sendNotification(DEADLINE) - 마감 알림을 전송한다")
    @Test
    void sendNotification_deadline() {
        // given
        given(roomRepository.findById(roomId)).willReturn(Optional.of(room));
        given(platformRepository.findByRoomId(roomId)).willReturn(Optional.of(platform));

        // when
        platformNotificationService.sendNotification(roomId, PlatformNotificationType.DEADLINE);

        // then
        then(platformMessageSender).should().sendDeadlineAlertMessage(
                eq("test-channel-id"),
                eq(room.getSession()),
                eq("Test Room")
        );
        then(platformMessageSender).shouldHaveNoMoreInteractions();
    }

    @DisplayName("sendNotification(CREATION) - 생성 알림을 전송한다")
    @Test
    void sendNotification_creation() {
        // given
        given(roomRepository.findById(roomId)).willReturn(Optional.of(room));
        given(platformRepository.findByRoomId(roomId)).willReturn(Optional.of(platform));

        // when
        platformNotificationService.sendNotification(roomId, PlatformNotificationType.CREATION);

        // then
        then(platformMessageSender).should().sendConnectedRoomCreatedMessage(
                eq("test-channel-id"),
                eq(room.getSession()),
                eq("Test Room"),
                eq(room.getDeadline())
        );
        then(platformMessageSender).shouldHaveNoMoreInteractions();
    }
}
