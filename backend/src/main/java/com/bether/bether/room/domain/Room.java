package com.bether.bether.room.domain;

import com.bether.bether.common.BaseEntity;
import com.bether.bether.datetimeslot.domain.DateTimeSlot;
import com.bether.bether.room.infrastructure.RoomSessionGenerator;
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
    private String session;

    @Column(name = "title", nullable = false)
    private String title;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "room_available_dates",
            joinColumns = @JoinColumn(name = "room_id")
    )
    private List<LocalDate> availableDates = new ArrayList<>();

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "dead_line", nullable = false)
    private LocalDateTime deadLine;

    @Column(name = "is_public", nullable = false)
    private boolean isPublic;

    public static Room withoutId(
            final String title,
            final List<LocalDate> availableDates,
            final LocalTime startTime,
            final LocalTime endTime,
            final LocalDateTime deadLine,
            final Boolean isPublic
    ) {
        validate(title, availableDates, startTime, endTime, deadLine);
        validateDates(availableDates);
        validateTimes(startTime, endTime);
        validateDeadLine(deadLine);
        final String session = RoomSessionGenerator.generateTsid();
        return new Room(session, title, availableDates, startTime, endTime, deadLine, isPublic);
    }

    private static void validate(
            final String title,
            final List<LocalDate> availableDates,
            final LocalTime startTime,
            final LocalTime endTime,
            final LocalDateTime deadLine) {
        if (title == null || availableDates == null || startTime == null || endTime == null
                || deadLine == null) {
            throw new IllegalArgumentException(
                    "title, availableDates, startTime, endTime, deadLine cannot be null");
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

    private static void validateTimes(final LocalTime startTime, final LocalTime endTime) {
        if (endTime.isBefore(startTime)) {
            throw new IllegalArgumentException("startTime cannot be after endTime");
        }
        final long timeSlotMinutes = DateTimeSlot.UNIT.toMinutes();
        if (startTime.getMinute() % timeSlotMinutes != 0 || endTime.getMinute() % timeSlotMinutes != 0) {
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
