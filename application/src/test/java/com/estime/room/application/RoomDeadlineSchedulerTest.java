package com.estime.room.application;

import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.estime.notification.application.NotificationService;
import com.estime.room.domain.Room;
import com.estime.room.domain.RoomRepository;
import com.estime.room.domain.platform.Platform;
import com.estime.room.domain.platform.PlatformNotification;
import com.estime.room.domain.platform.PlatformRepository;
import com.estime.room.domain.platform.PlatformType;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class RoomDeadlineSchedulerTest {

    @Autowired
    private RoomDeadlineScheduler roomDeadlineScheduler;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private PlatformRepository platformRepository;

    @MockitoBean
    private NotificationService notificationService;

    @DisplayName("초기화 시, 마감 시간이 미래인 기존 방들의 알림 작업이 큐에 등록되고, 시간이 되면 알림을 보낸다")
    @Test
    void initialize_schedulesTasksForExistingRooms() throws InterruptedException {
        // given
        final LocalDateTime now = LocalDateTime.now();
        final LocalDateTime deadline = now.plusSeconds(3);
        final Room roomForDeadline = Room.withoutId("Test Room", List.of(), List.of(), deadline);
        roomRepository.save(roomForDeadline);

        final PlatformNotification notification = PlatformNotification.of(false, true, true);
        final Platform platform = Platform.withoutId(
                roomForDeadline.getId(),
                PlatformType.DISCORD,
                "test-channel-123",
                notification
        );
        platformRepository.save(platform);

        // when
        roomDeadlineScheduler.initialize();
        Thread.sleep(5000); // Wait for deadline to pass
        roomDeadlineScheduler.processTaskQueue();

        // then
        verify(notificationService, times(1)).sendDeadlineAlert(roomForDeadline.getId());
    }

    @DisplayName("새로운 방 폴링 시, 신규 방에 대한 알림 작업이 큐에 등록되고, 시간이 되면 알림을 보낸다")
    @Test
    void pollNewRooms_schedulesTasksForNewRooms() throws InterruptedException {
        // given
        final LocalDateTime now = LocalDateTime.now();

        final Room room1 = Room.withoutId("Test Room 1", List.of(), List.of(), now.plusDays(1));
        roomRepository.save(room1);
        final Room room2 = Room.withoutId("Test Room 2", List.of(), List.of(), now.plusDays(2));
        roomRepository.save(room2);
        roomDeadlineScheduler.initialize();

        final LocalDateTime deadline = now.plusSeconds(3);
        final Room newRoomForDeadline = Room.withoutId("New Test Room", List.of(), List.of(), deadline);
        roomRepository.save(newRoomForDeadline);

        final PlatformNotification notification = PlatformNotification.of(false, true, true);
        final Platform platform = Platform.withoutId(
                newRoomForDeadline.getId(),
                PlatformType.DISCORD,
                "test-channel-456",
                notification
        );
        platformRepository.save(platform);

        // when
        roomDeadlineScheduler.pollNewRooms();
        Thread.sleep(5000); // Wait for deadline to pass
        roomDeadlineScheduler.processTaskQueue();

        // then
        verify(notificationService, times(1)).sendDeadlineAlert(newRoomForDeadline.getId());
    }

    @DisplayName("마감 1시간 전에 리마인더 알림을 보낸다")
    @Test
    void processTaskQueue_sendsReminderBeforeDeadline() throws InterruptedException {
        // given
        final LocalDateTime now = LocalDateTime.now();
        final LocalDateTime deadline = now.plusHours(1).plusSeconds(3); // 1시간 3초 후
        final Room room = Room.withoutId("Test Room", List.of(), List.of(), deadline);
        roomRepository.save(room);

        final PlatformNotification notification = PlatformNotification.of(false, true, true);
        final Platform platform = Platform.withoutId(
                room.getId(),
                PlatformType.DISCORD,
                "test-channel-789",
                notification
        );
        platformRepository.save(platform);

        // when
        roomDeadlineScheduler.initialize();
        Thread.sleep(5000);
        roomDeadlineScheduler.processTaskQueue();

        // then
        verify(notificationService, times(1)).sendReminderNotification(room.getId());
        verify(notificationService, never()).sendDeadlineAlert(room.getId()); // 아직 deadline 안됨
    }

    @DisplayName("플랫폼과 연결된 방에만 알림을 전송한다")
    @Test
    void processTaskQueue_sendsNotificationOnlyToPlatformConnectedRooms() throws InterruptedException {
        // given
        final LocalDateTime now = LocalDateTime.now();
        final LocalDateTime deadline = now.plusSeconds(3);
        final Room roomWithPlatform = Room.withoutId("Room with Platform", List.of(), List.of(), deadline);
        roomRepository.save(roomWithPlatform);

        final PlatformNotification notification = PlatformNotification.of(false, true, true);
        final Platform platform = Platform.withoutId(
                roomWithPlatform.getId(),
                PlatformType.DISCORD,
                "test-channel-with-platform",
                notification
        );
        platformRepository.save(platform);

        // when
        roomDeadlineScheduler.initialize();
        Thread.sleep(5000); // Wait for deadline to pass
        roomDeadlineScheduler.processTaskQueue();

        // then
        verify(notificationService, times(1)).sendDeadlineAlert(roomWithPlatform.getId());
    }

    @DisplayName("플랫폼과 연결되지 않은 방에는 알림을 전송하지 않는다")
    @Test
    void processTaskQueue_skipsNotificationForRoomsWithoutPlatform() throws InterruptedException {
        // given
        final LocalDateTime now = LocalDateTime.now();
        final LocalDateTime deadline = now.plusSeconds(3);
        final Room roomWithoutPlatform = Room.withoutId("Room no Platform", List.of(), List.of(), deadline);
        roomRepository.save(roomWithoutPlatform);

        // 플랫폼을 등록하지 않음 (연결되지 않은 상태)

        // when
        roomDeadlineScheduler.initialize();
        Thread.sleep(5000); // Wait for deadline to pass
        roomDeadlineScheduler.processTaskQueue();

        // then
        verify(notificationService, never()).sendDeadlineAlert(roomWithoutPlatform.getId());
        verify(notificationService, never()).sendReminderNotification(roomWithoutPlatform.getId());
    }
}
