package com.estime.room.schedule;

import com.estime.notification.NotificationService;
import com.estime.room.Room;
import com.estime.room.RoomRepository;
import com.estime.room.platform.PlatformRepository;
import jakarta.annotation.PostConstruct;
import java.time.Duration;
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

    private static final Duration REMINDER_BEFORE_DEADLINE = Duration.ofHours(1);

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
        pollNewRoomsAt(LocalDateTime.now());
    }

    public void pollNewRoomsAt(final LocalDateTime referenceTime) {
        final Long currentLastId = lastCheckedRoomId.get();
        final List<Room> newRooms;

        if (currentLastId == null) {
            log.warn("No last checked ID found, re-initializing from all rooms.");
            newRooms = roomRepository.findAllByDeadlineAfter(referenceTime);
        } else {
            log.info("Polling for new rooms with ID greater than {}.", currentLastId);
            newRooms = roomRepository.findAllByIdGreaterThanOrderByIdAsc(currentLastId);
        }

        if (newRooms.isEmpty()) {
            return;
        }

        log.info("Found {} new rooms to schedule.", newRooms.size());
        populateQueueWithTasks(newRooms, referenceTime);

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

        while (hasTaskDueBy(currentTime)) {
            final NotificationTask task = taskQueue.poll();
            if (task == null) {
                break; // 동시성 문제로 큐가 비었을 수 있음
            }
            processTask(task);
        }
    }

    private boolean hasTaskDueBy(final LocalDateTime currentTime) {
        if (taskQueue.isEmpty()) {
            return false;
        }
        final NotificationTask nextTask = taskQueue.peek();
        return nextTask.executionTime().isBefore(currentTime) || nextTask.executionTime().equals(currentTime);
    }

    private void processTask(final NotificationTask task) {
        log.info("Processing task: {} for roomId: {}", task.taskType(), task.roomId());

        if (platformRepository.findByRoomId(task.roomId()).isEmpty()) {
            log.debug("Skipping notification for roomId: {} - no platform connected", task.roomId());
            return;
        }

        switch (task.taskType()) {
            case NotificationTaskType.REMIND -> notificationService.sendReminderNotification(task.roomId());
            case NotificationTaskType.DEADLINE -> notificationService.sendDeadlineAlert(task.roomId());
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

            final LocalDateTime reminderTime = deadline.minus(REMINDER_BEFORE_DEADLINE);
            if (reminderTime.isAfter(referenceTime)) {
                taskQueue.add(
                        new NotificationTask(room.getId(), reminderTime, NotificationTaskType.REMIND));
            }
        }
    }
}
