package com.bether.bether.room.domain;

import com.bether.bether.common.BaseEntity;
import com.bether.bether.datetimeslot.domain.DateTimeSlot;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@ToString
public class Room extends BaseEntity {

    @Column(name = "session", nullable = false)
    private UUID session;

    @Column(name = "title", nullable = false)
    private String title;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "room_available_dates",
            joinColumns = @JoinColumn(name = "room_id")
    )
    private List<LocalDate> availableDates = new ArrayList<>();

    @Column(name = "start_time_start_at", nullable = false)
    private LocalTime startTimeStartAt;


    @Column(name = "end_time_start_at", nullable = false)
    private LocalTime endTimeStartAt;

    @Column(name = "dead_line", nullable = false)
    private LocalDateTime deadLine;

    @Column(name = "is_public", nullable = false)
    private boolean isPublic;

    public static Room withoutId(
            final String title,
            final List<LocalDate> availableDates,
            final LocalTime startTimeStartAt,
            final LocalTime endTimeStartAt,
            final LocalDateTime deadLine,
            final Boolean isPublic
    ) {
        validate(title, availableDates, startTimeStartAt, endTimeStartAt, deadLine);
        validateDates(availableDates);
        validateTimes(startTimeStartAt, endTimeStartAt);
        validateDeadLine(deadLine);
        final UUID session = UUID.randomUUID();
        return new Room(session, title, availableDates, startTimeStartAt, endTimeStartAt, deadLine, isPublic);
    }

    private static void validate(
            final String title,
            final List<LocalDate> availableDates,
            final LocalTime startTimeStartAt,
            final LocalTime endTimeStartAt,
            final LocalDateTime deadLine) {
        if (title == null || availableDates == null || startTimeStartAt == null || endTimeStartAt == null
                || deadLine == null) {
            throw new IllegalArgumentException(
                    "title, availableDates, startTimeStartAt, endTimeStartAt, deadLine cannot be null");
        }
    }

    private static void validateDates(final List<LocalDate> availableDates) {
        if (availableDates.isEmpty()) {
            throw new IllegalArgumentException("availableDates cannot be empty");
        }
        for (final LocalDate date : availableDates) {
            if (date.isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("availableDates cannot contain past dates: " + date);
            }
        }
    }

    private static void validateTimes(final LocalTime startTimeStartAt, final LocalTime endTimeStartAt) {
        if (endTimeStartAt.isBefore(startTimeStartAt)) {
            throw new IllegalArgumentException("startTimeStartAt cannot be after endTimeStartAt");
        }
        final long timeSlotMinutes = DateTimeSlot.UNIT.toMinutes();
        if (startTimeStartAt.getMinute() % timeSlotMinutes != 0 || endTimeStartAt.getMinute() % timeSlotMinutes != 0) {
            throw new IllegalArgumentException("time must be in " + timeSlotMinutes + "-minute intervals");
        }
    }

    private static void validateDeadLine(final LocalDateTime deadLine) {
        if (deadLine.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("The deadline cannot be in the past.");
        }
        if (deadLine.getMinute() != 0 && deadLine.getMinute() != 30) {
            throw new IllegalArgumentException("The deadline must be set in 30-minute intervals.");
        }
    }
}
