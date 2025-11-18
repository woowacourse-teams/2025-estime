package com.estime.room.schedule;

import com.estime.notification.NotificationService;
import com.estime.room.Room;
import com.estime.room.RoomRepository;
import com.estime.room.platform.PlatformRepository;
import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Queue;
import java.util.concurrent.PriorityBlockingQueue;
import java.util.concurrent.atomic.AtomicReference;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class RoomDeadlineScheduler {

    private static final int REMINDER_HOURS_BEFORE_DEADLINE = 1;

    private final RoomRepository roomRepository;
    private final PlatformRepository platformRepository;
    private final NotificationService notificationService;
    private final Queue<NotificationTask> taskQueue = new PriorityBlockingQueue<>();
    private final AtomicReference<Long> lastCheckedRoomId = new AtomicReference<>();

    @PostConstruct
    public void initialize() {
        log.info("Initializing scheduler: Populating task queue from existing rooms...");
        final LocalDateTime now = LocalDateTime.now();

        final List<Room> existingRooms = roomRepository.findAllByDeadlineAfter(now);
        populateQueueWithTasks(existingRooms, now);

        existingRooms.stream()
                .map(Room::getId)
                .max(Comparator.naturalOrder())
                .ifPresent(lastCheckedRoomId::set);

        log.info("Scheduler initialized. Last checked ID: {}. Initial queue size: {}",
                lastCheckedRoomId.get(), taskQueue.size());
    }

    @Scheduled(cron = "0 */5 * * * *")
    public void pollNewRooms() {
        final Long currentLastId = lastCheckedRoomId.get();
        final List<Room> newRooms;
        final LocalDateTime now = LocalDateTime.now();

        if (currentLastId == null) {
            log.warn("No last checked ID found, re-initializing from all rooms.");
            newRooms = roomRepository.findAllByDeadlineAfter(now);
        } else {
            log.info("Polling for new rooms with ID greater than {}.", currentLastId);
            newRooms = roomRepository.findAllByIdGreaterThanOrderByIdAsc(currentLastId);
        }

        if (newRooms.isEmpty()) {
            return;
        }

        log.info("Found {} new rooms to schedule.", newRooms.size());
        populateQueueWithTasks(newRooms, now);

        newRooms.stream()
                .map(Room::getId)
                .max(Comparator.naturalOrder())
                .ifPresent(lastCheckedRoomId::set);

        log.info("Polling complete. Last checked ID is now {}. Queue size is {}.",
                lastCheckedRoomId.get(), taskQueue.size());
    }

    @Scheduled(cron = "0 */5 * * * *")
    public void processTaskQueue() {
        processTaskQueueAt(LocalDateTime.now());
    }

    public void processTaskQueueAt(final LocalDateTime currentTime) {
        log.debug("Processing task queue at {}. Current queue size: {}", currentTime, taskQueue.size());

        while (!taskQueue.isEmpty() && !taskQueue.peek().executionTime().isAfter(currentTime)) {
            final NotificationTask task = taskQueue.poll();
            log.info("Processing task: {} for roomId: {}", task.taskType(), task.roomId());

            if (platformRepository.findByRoomId(task.roomId()).isEmpty()) {
                log.debug("Skipping notification for roomId: {} - no platform connected", task.roomId());
                continue;
            }

            switch (task.taskType()) {
                case NotificationTaskType.REMIND -> notificationService.sendReminderNotification(task.roomId());
                case NotificationTaskType.DEADLINE -> notificationService.sendDeadlineAlert(task.roomId());
            }
        }
    }

    private void populateQueueWithTasks(final List<Room> rooms, final LocalDateTime referenceTime) {
        if (rooms == null || rooms.isEmpty()) {
            return;
        }

        for (final Room room : rooms) {
            final LocalDateTime deadline = room.getDeadline();
            if (!deadline.isAfter(referenceTime)) {
                continue;
            }

            taskQueue.add(new NotificationTask(room.getId(), deadline, NotificationTaskType.DEADLINE));

            final LocalDateTime reminderTime = deadline.minusHours(REMINDER_HOURS_BEFORE_DEADLINE);
            if (reminderTime.isAfter(referenceTime)) {
                taskQueue.add(
                        new NotificationTask(room.getId(), reminderTime, NotificationTaskType.REMIND));
            }
        }
    }
}
