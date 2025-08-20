package com.estime.room.application;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.estime.notification.application.NotificationService;
import com.estime.room.domain.Room;
import com.estime.room.domain.RoomRepository;
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

    @MockitoBean
    private NotificationService notificationService;

    @Test
    @DisplayName("초기화 시, 마감 시간이 미래인 기존 방들의 알림 작업이 큐에 등록되고, 시간이 되면 알림을 보낸다")
    void initialize_schedulesTasksForExistingRooms() throws InterruptedException {
        // given
        final LocalDateTime now = LocalDateTime.now();
        final LocalDateTime deadline = now.plusSeconds(3);
        final Room roomForDeadline = Room.withoutId("Test Room", List.of(), List.of(), deadline);
        roomRepository.save(roomForDeadline);

        // when
        roomDeadlineScheduler.initialize();
        Thread.sleep(5000); // Wait for deadline to pass
        roomDeadlineScheduler.processTaskQueue();

        // then
        verify(notificationService, times(1)).sendDeadlineAlert(roomForDeadline.getId());
    }

    @Test
    @DisplayName("새로운 방 폴링 시, 신규 방에 대한 알림 작업이 큐에 등록되고, 시간이 되면 알림을 보낸다")
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

        // when
        roomDeadlineScheduler.pollNewRooms();
        Thread.sleep(5000); // Wait for deadline to pass
        roomDeadlineScheduler.processTaskQueue();

        // then
        verify(notificationService, times(1)).sendDeadlineAlert(newRoomForDeadline.getId());
    }

    @Test
    @DisplayName("마감 1시간 전에 리마인더 알림을 보낸다")
    void processTaskQueue_sendsReminderBeforeDeadline() throws InterruptedException {
        // given
        final LocalDateTime now = LocalDateTime.now();
        final LocalDateTime deadline = now.plusHours(1).plusSeconds(3); // 1시간 3초 후
        final Room room = Room.withoutId("Test Room", List.of(), List.of(), deadline);
        roomRepository.save(room);

        // when
        roomDeadlineScheduler.initialize();
        Thread.sleep(5000);
        roomDeadlineScheduler.processTaskQueue();

        // then
        verify(notificationService, times(1)).sendReminderNotification(room.getId());
        verify(notificationService, never()).sendDeadlineAlert(room.getId()); // 아직 deadline 안됨
    }
}
