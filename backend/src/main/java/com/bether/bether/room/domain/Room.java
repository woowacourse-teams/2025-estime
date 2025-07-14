package com.bether.bether.room.domain;

import com.bether.bether.common.BaseEntity;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import java.time.LocalDate;
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

    private static final int TIME_SLOT_MINUTES = 30;

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

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    public static Room withoutId(
        final String title,
        final List<LocalDate> availableDates,
        final LocalTime startTime,
        final LocalTime endTime
    ) {
        validate(title, availableDates, startTime, endTime);
        validateDates(availableDates);
        validateTimes(startTime, endTime);
        final UUID session = UUID.randomUUID();
        return new Room(session, title, availableDates, startTime, endTime);
    }

    private static void validate(
        final String title,
        final List<LocalDate> availableDates,
        final LocalTime startTime,
        final LocalTime endTime
    ) {
        if (title == null || availableDates == null || startTime == null || endTime == null) {
            throw new IllegalArgumentException("title, availableDates, startTime, endTime cannot be null");
        }
    }

    private static void validateDates(final List<LocalDate> availableDates) {
        if (availableDates.isEmpty()) {
            throw new IllegalArgumentException("availableDates cannot be empty");
        }
        for (LocalDate date : availableDates) {
            if (date.isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("availableDates cannot contain past dates: " + date);
            }
        }
    }

    private static void validateTimes(final LocalTime startTime, final LocalTime endTime) {
        if (!startTime.isBefore(endTime)) {
            throw new IllegalArgumentException("startTime cannot be after endTime");
        }
        if (startTime.getMinute() % TIME_SLOT_MINUTES != 0 || endTime.getMinute() % TIME_SLOT_MINUTES != 0) {
            throw new IllegalArgumentException("time must be in " + TIME_SLOT_MINUTES + "-minute intervals");
        }
    }
}
