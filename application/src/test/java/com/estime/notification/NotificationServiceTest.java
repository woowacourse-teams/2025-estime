package com.estime.notification;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import com.estime.port.out.PlatformMessageSender;
import com.estime.room.Room;
import com.estime.room.RoomRepository;
import com.estime.room.RoomSession;
import com.estime.room.platform.Platform;
import com.estime.room.platform.notification.PlatformNotification;
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
class NotificationServiceTest {

    private final Long roomId = 1L;
    @Mock
    private RoomRepository roomRepository;
    @Mock
    private PlatformRepository platformRepository;
    @Mock
    private PlatformMessageSender platformMessageSender;
    @InjectMocks
    private NotificationService notificationService;
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

    @DisplayName("sendReminderNotification() - 리마인더 알림을 전송한다")
    @Test
    void sendReminderNotification() {
        // given
        given(roomRepository.findById(roomId)).willReturn(Optional.of(room));
        given(platformRepository.findByRoomId(roomId)).willReturn(Optional.of(platform));

        // when
        notificationService.sendReminderNotification(roomId);

        // then
        then(platformMessageSender).should().sendReminderMessage(
                eq("test-channel-id"),
                eq(room.getSession()),
                eq("Test Room"),
                eq(room.getDeadline())
        );
        then(platformMessageSender).shouldHaveNoMoreInteractions();
    }

    @DisplayName("sendReminderNotification() - 방이 존재하지 않으면 알림을 전송하지 않는다")
    @Test
    void sendReminderNotification_roomNotFound() {
        // given
        given(roomRepository.findById(roomId)).willReturn(Optional.empty());

        // when
        notificationService.sendReminderNotification(roomId);

        // then
        then(platformMessageSender).shouldHaveNoInteractions();
    }

    @DisplayName("sendReminderNotification() - 플랫폼이 존재하지 않으면 알림을 전송하지 않는다")
    @Test
    void sendReminderNotification_platformNotFound() {
        // given
        given(roomRepository.findById(roomId)).willReturn(Optional.of(room));
        given(platformRepository.findByRoomId(roomId)).willReturn(Optional.empty());

        // when
        notificationService.sendReminderNotification(roomId);

        // then
        then(platformMessageSender).shouldHaveNoInteractions();
    }

    @DisplayName("sendDeadlineNotification() - 마감 알림을 전송한다")
    @Test
    void sendDeadlineNotification() {
        // given
        given(roomRepository.findById(roomId)).willReturn(Optional.of(room));
        given(platformRepository.findByRoomId(roomId)).willReturn(Optional.of(platform));

        // when
        notificationService.sendDeadlineNotification(roomId);

        // then
        then(platformMessageSender).should().sendDeadlineAlertMessage(
                eq("test-channel-id"),
                eq(room.getSession()),
                eq("Test Room")
        );
        then(platformMessageSender).shouldHaveNoMoreInteractions();
    }

    @DisplayName("sendDeadlineNotification() - 방이 존재하지 않으면 알림을 전송하지 않는다")
    @Test
    void sendDeadlineNotification_roomNotFound() {
        // given
        given(roomRepository.findById(roomId)).willReturn(Optional.empty());

        // when
        notificationService.sendDeadlineNotification(roomId);

        // then
        then(platformMessageSender).shouldHaveNoInteractions();
    }

    @DisplayName("sendDeadlineNotification() - 플랫폼이 존재하지 않으면 알림을 전송하지 않는다")
    @Test
    void sendDeadlineNotification_platformNotFound() {
        // given
        given(roomRepository.findById(roomId)).willReturn(Optional.of(room));
        given(platformRepository.findByRoomId(roomId)).willReturn(Optional.empty());

        // when
        notificationService.sendDeadlineNotification(roomId);

        // then
        then(platformMessageSender).shouldHaveNoInteractions();
    }
}
