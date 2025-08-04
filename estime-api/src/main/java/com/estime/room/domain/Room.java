package com.estime.room.domain;

import com.estime.common.BaseEntity;
import com.estime.room.domain.participant.vote.vo.DateSlot;
import com.estime.room.domain.participant.vote.vo.DateTimeSlot;
import com.estime.room.domain.participant.vote.vo.TimeSlot;
import com.estime.room.infrastructure.participant.slot.converter.DateSlotConverter;
import com.estime.room.infrastructure.participant.slot.converter.DateTimeSlotConverter;
import com.estime.room.infrastructure.participant.slot.converter.TimeSlotConverter;
import com.estime.room.infrastructure.RoomSessionGenerator;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
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

    @Column(name = "session", nullable = false, length = 13, columnDefinition = "CHAR(13) CHARACTER SET ascii")
    private String session;

    @Column(name = "title", nullable = false)
    private String title;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "room_available_date_slot",
            joinColumns = @JoinColumn(name = "room_id")
    )
    @Column(name = "start_at", nullable = false)
    @Convert(converter = DateSlotConverter.class)
    private Set<DateSlot> availableDateSlots = new HashSet<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "room_available_time_slot",
            joinColumns = @JoinColumn(name = "room_id")
    )
    @Column(name = "start_at", nullable = false)
    @Convert(converter = TimeSlotConverter.class)
    private Set<TimeSlot> availableTimeSlots = new HashSet<>();

    @Column(name = "deadline", nullable = false)
    @Convert(converter = DateTimeSlotConverter.class)
    private DateTimeSlot deadline;

    @Column(name = "is_public", nullable = false)
    private boolean isPublic;

    public static Room withoutId(
            final String title,
            final Collection<DateSlot> availableDateSlots,
            final Collection<TimeSlot> availableTimeSlots,
            final DateTimeSlot deadline,
            final Boolean isPublic
    ) {
        validateNonNull(title, availableDateSlots, availableTimeSlots, deadline, isPublic);
        final String session = RoomSessionGenerator.generateTsid();
        return new Room(
                session,
                title,
                (Set<DateSlot>) availableDateSlots,
                (Set<TimeSlot>) availableTimeSlots,
                deadline,
                isPublic
        );
    }

    private static void validateNonNull(
            final String title,
            final Collection<DateSlot> availableDateSlots,
            final Collection<TimeSlot> availableTimeSlots,
            final DateTimeSlot deadline,
            final Boolean isPublic
    ) {
        Objects.requireNonNull(title, "title cannot be null");
        Objects.requireNonNull(availableDateSlots, "availableDateSlots cannot be null");
        Objects.requireNonNull(availableTimeSlots, "availableTimeSlots cannot be null");
        Objects.requireNonNull(deadline, "deadline cannot be null");
        Objects.requireNonNull(isPublic, "isPublic cannot be null");
    }

    private static void validateDeadline(final DateTimeSlot deadline) {
        if (deadline.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("deadline cannot be in the past.");
        }
    }
}
