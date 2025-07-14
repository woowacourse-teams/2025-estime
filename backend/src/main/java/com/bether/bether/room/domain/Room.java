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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString
public class Room extends BaseEntity {

    @Column(name = "session", nullable = false, unique = true)
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

    private Room(
        final UUID session,
        final String title,
        final List<LocalDate> availableDates,
        final LocalTime startTime,
        final LocalTime endTime
    ) {
        this.session = session;
        this.title = title;
        this.availableDates = availableDates;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    private Room(
        final Long id,
        final UUID session,
        final String title,
        final List<LocalDate> availableDates,
        final LocalTime startTime,
        final LocalTime endTime
    ) {
        super(id);
        this.session = session;
        this.title = title;
        this.availableDates = availableDates;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public static Room withoutId(
        final String title,
        final List<LocalDate> availableDates,
        final LocalTime startTime,
        final LocalTime endTime
    ) {
        validate(title, availableDates, startTime, endTime);
        final UUID session = UUID.randomUUID();
        return new Room(session, title, availableDates, startTime, endTime);
    }

    public static Room withId(
        final Long id,
        final String title,
        final List<LocalDate> availableDates,
        final LocalTime startTime,
        final LocalTime endTime
    ) {
        validate(id, title, availableDates, startTime, endTime);
        final UUID session = UUID.randomUUID();
        return new Room(id, session, title, availableDates, startTime, endTime);
    }

    private static void validate(
        final Long id,
        final String title,
        final List<LocalDate> availableDates,
        final LocalTime startTime,
        final LocalTime endTime
    ) {
        if (id == null) {
            throw new IllegalArgumentException("id cannot be null");
        }
        validate(title, availableDates, startTime, endTime);
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
}
