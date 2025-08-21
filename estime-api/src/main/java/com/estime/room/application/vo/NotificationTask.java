package com.estime.room.application.vo;

import java.time.LocalDateTime;

public record NotificationTask(
        Long roomId,
        LocalDateTime executionTime,
        NotificationTaskType taskType
) implements Comparable<NotificationTask> {

    @Override
    public int compareTo(final NotificationTask other) {
        return this.executionTime.compareTo(other.executionTime);
    }
}
