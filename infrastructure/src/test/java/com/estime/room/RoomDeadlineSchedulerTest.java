package com.estime.room;

import static org.assertj.core.api.Assertions.assertThat;

import com.estime.TestApplication;
import com.estime.room.platform.Platform;
import com.estime.room.platform.PlatformNotification;
import com.estime.room.platform.PlatformRepository;
import com.estime.room.platform.PlatformType;
import com.estime.room.schedule.RoomDeadlineScheduler;
import com.estime.support.TestPlatformMessageSender;
import java.time.LocalDateTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest(classes = TestApplication.class)
@ActiveProfiles("test")
@Transactional
class RoomDeadlineSchedulerTest {

    private static final RoomSession roomSession = RoomSession.from("testRoomSession");

    @Autowired
    private RoomDeadlineScheduler roomDeadlineScheduler;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private PlatformRepository platformRepository;

    @Autowired
    private TestPlatformMessageSender testPlatformMessageSender;

    @BeforeEach
    void setUp() {
        testPlatformMessageSender.clear();
    }

    @DisplayName("초기화 시 마감 시간이 미래인 기존 방들을 스케줄링하고, 마감 시간에 알림을 보낸다")
    @Test
    void initialize_schedulesAndProcessesFutureRooms() {
        // given
        final LocalDateTime now = LocalDateTime.now();
        final LocalDateTime deadline = now.plusMinutes(10);
        final Room room = Room.withoutId("Future Room", roomSession, deadline);
        roomRepository.save(room);

        final PlatformNotification notification = PlatformNotification.of(false, true, true);
        platformRepository.save(Platform.withoutId(
                room.getId(),
                PlatformType.DISCORD,
                "test-channel-123",
                notification
        ));

        // when
        roomDeadlineScheduler.initialize();
        roomDeadlineScheduler.processTaskQueueAt(deadline.plusSeconds(1)); // 마감 시간 이후로 시간을 이동

        // then
        assertThat(testPlatformMessageSender.getSentMessages())
                .anyMatch(msg -> msg.contains("DeadlineAlert"));
    }

    @DisplayName("새로운 방 폴링 시 신규 방을 스케줄링에 추가하고 알림을 보낸다")
    @Test
    void pollNewRooms_addsNewRoomsAndSendsNotification() {
        // given
        final LocalDateTime now = LocalDateTime.now();
        final Room existingRoom = Room.withoutId("Existing Room", roomSession, now.plusDays(1));
        roomRepository.save(existingRoom);
        roomDeadlineScheduler.initialize();

        final LocalDateTime newDeadline = now.plusMinutes(10);
        final Room newRoom = Room.withoutId("New Room", RoomSession.from("newSession"), newDeadline);
        roomRepository.save(newRoom);

        final PlatformNotification notification = PlatformNotification.of(false, true, true);
        platformRepository.save(Platform.withoutId(
                newRoom.getId(),
                PlatformType.DISCORD,
                "test-channel-new",
                notification
        ));

        // when
        roomDeadlineScheduler.pollNewRooms();
        roomDeadlineScheduler.processTaskQueueAt(newDeadline.plusSeconds(1)); // 시간 이동

        // then
        assertThat(testPlatformMessageSender.getSentMessages())
                .anyMatch(msg -> msg.contains("DeadlineAlert"));
    }

    @DisplayName("플랫폼과 연결되지 않은 방은 알림을 보내지 않는다")
    @Test
    void processTaskQueue_skipsRoomsWithoutPlatform() {
        // given
        final LocalDateTime now = LocalDateTime.now();
        final LocalDateTime deadline = now.plusMinutes(10);
        final Room roomWithoutPlatform = Room.withoutId("No Platform Room",
                RoomSession.from("noPlatformSession"),
                deadline);
        roomRepository.save(roomWithoutPlatform);

        // 플랫폼 연결 없음

        // when
        roomDeadlineScheduler.initialize();
        roomDeadlineScheduler.processTaskQueueAt(deadline.plusSeconds(1));

        // then
        assertThat(testPlatformMessageSender.getSentMessages()).isEmpty();
    }

    @DisplayName("마감 1시간 전에 리마인더 알림을 보낸다")
    @Test
    void processTaskQueue_sendsReminderBeforeDeadline() {
        // given
        final LocalDateTime now = LocalDateTime.now();
        final LocalDateTime deadline = now.plusHours(2);
        final LocalDateTime reminderTime = deadline.minusHours(1);
        final Room room = Room.withoutId("Test Room", RoomSession.from("reminderSession"), deadline);
        roomRepository.save(room);

        final PlatformNotification notification = PlatformNotification.of(false, true, true);
        platformRepository.save(Platform.withoutId(
                room.getId(),
                PlatformType.DISCORD,
                "test-channel-reminder",
                notification
        ));

        // when
        roomDeadlineScheduler.initialize();
        roomDeadlineScheduler.processTaskQueueAt(reminderTime.plusSeconds(1)); // 리마인더 시간으로 이동

        // then
        assertThat(testPlatformMessageSender.getSentMessages())
                .anyMatch(msg -> msg.contains("Reminder"));
        assertThat(testPlatformMessageSender.getSentMessages())
                .noneMatch(msg -> msg.contains("DeadlineAlert")); // 아직 마감 전
    }

    @DisplayName("여러 방의 알림을 순차적으로 처리한다")
    @Test
    void initialize_schedulesMultipleRoomsAndProcessesThem() {
        // given
        final LocalDateTime now = LocalDateTime.now();
        final LocalDateTime deadline1 = now.plusMinutes(10);
        final LocalDateTime deadline2 = deadline1.plusMinutes(10);

        final Room room1 = Room.withoutId("Room 1", RoomSession.from("session1"), deadline1);
        final Room room2 = Room.withoutId("Room 2", RoomSession.from("session2"), deadline2);
        roomRepository.save(room1);
        roomRepository.save(room2);

        final PlatformNotification notification = PlatformNotification.of(false, true, true);
        platformRepository.save(Platform.withoutId(room1.getId(), PlatformType.DISCORD, "channel1", notification));
        platformRepository.save(Platform.withoutId(room2.getId(), PlatformType.DISCORD, "channel2", notification));

        // when
        roomDeadlineScheduler.initialize();
        roomDeadlineScheduler.processTaskQueueAt(deadline1.plusSeconds(1)); // room1 마감 시간

        // then
        assertThat(testPlatformMessageSender.getSentMessages()).hasSize(1); // room1만 처리됨

        // when - room2 마감 시간으로 이동
        roomDeadlineScheduler.processTaskQueueAt(deadline2.plusSeconds(1));

        // then
        assertThat(testPlatformMessageSender.getSentMessages()).hasSize(2); // room2도 처리됨
    }
}
