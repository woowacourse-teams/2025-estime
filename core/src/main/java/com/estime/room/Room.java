package com.estime.room;

import com.estime.room.exception.DeadlineOverdueException;
import com.estime.room.exception.PastNotAllowedException;
import com.estime.room.exception.UnavailableSlotException;
import com.estime.room.participant.vote.exception.DuplicateNotAllowedException;
import com.estime.room.slot.DateTimeSlot;
import com.estime.room.slot.RoomAvailableSlot;
import com.estime.shared.BaseEntity;
import com.estime.shared.DomainTerm;
import com.estime.shared.Validator;
import com.estime.shared.exception.InvalidLengthException;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.FieldNameConstants;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString(exclude = "availableSlots")
@FieldNameConstants(level = AccessLevel.PRIVATE)
@Table(indexes = {
        @Index(name = "idx_room_session", columnList = "session"),
        @Index(name = "idx_room_deadline", columnList = "deadline")
})
public class Room extends BaseEntity {

    private static final int TITLE_MAX_LENGTH = 20;

    @Column(name = "session", nullable = false)
    private RoomSession session;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "deadline", nullable = false)
    private Instant deadline;

    @OneToMany(
            mappedBy = RoomAvailableSlot.Fields.room,
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<RoomAvailableSlot> availableSlots = new ArrayList<>();

    private Room(
            final RoomSession session,
            final String title,
            final Instant deadline
    ) {
        this.session = session;
        this.title = title;
        this.deadline = deadline;
    }

    public static Room withoutId(
            final String title,
            final RoomSession session,
            final Instant deadline,
            final List<DateTimeSlot> slots,
            final Instant now
    ) {
        validateNull(title, session, deadline, slots);
        final String trimmedTitle = title.trim();
        validateTitle(trimmedTitle);
        validateDeadline(deadline, now);
        validateAvailableSlotsNoDuplicate(slots);
        validateAvailableSlotsNotPast(slots, now);

        final Room room = new Room(session, trimmedTitle, deadline);
        slots.forEach(slot -> room.availableSlots.add(RoomAvailableSlot.of(slot, room)));
        return room;
    }

    private static void validateNull(
            final String title,
            final RoomSession session,
            final Instant deadline,
            final List<DateTimeSlot> slots
    ) {
        Validator.builder()
                .add(Fields.title, title)
                .add(Fields.session, session)
                .add(Fields.deadline, deadline)
                .add(Fields.availableSlots, slots)
                .validateNull();
    }

    private static void validateTitle(final String trimmedTitle) {
        if (trimmedTitle.isBlank() || trimmedTitle.length() > TITLE_MAX_LENGTH) {
            throw new InvalidLengthException(DomainTerm.ROOM, trimmedTitle);
        }
    }

    private static void validateDeadline(
            final Instant deadline,
            final Instant now
    ) {
        if (deadline.isBefore(now)) {
            throw new PastNotAllowedException(DomainTerm.DEADLINE, deadline);
        }
    }

    private static void validateAvailableSlotsNoDuplicate(final List<DateTimeSlot> slots) {
        if (new HashSet<>(slots).size() != slots.size()) {
            throw new DuplicateNotAllowedException(DomainTerm.DATE_TIME_SLOT, slots);
        }
    }

    private static void validateAvailableSlotsNotPast(
            final List<DateTimeSlot> availableSlots,
            final Instant now
    ) {
        for (final DateTimeSlot slot : availableSlots) {
            if (slot.getStartAt().isBefore(now)) {
                throw new PastNotAllowedException(DomainTerm.DATE_TIME_SLOT, slot);
            }
        }
    }

    public void ensureDeadlineNotPassed(final Instant currentDateTime) {
        if (deadline.isBefore(currentDateTime)) {
            throw new DeadlineOverdueException(session, deadline, currentDateTime);
        }
    }

    public void ensureAvailableSlots(final List<DateTimeSlot> slots) {
        final Set<DateTimeSlot> available = availableSlots.stream()
                .map(RoomAvailableSlot::getSlot)
                .collect(Collectors.toSet());

        for (final DateTimeSlot slot : slots) {
            if (!available.contains(slot)) {
                throw new UnavailableSlotException(DomainTerm.DATE_TIME_SLOT, session, slot);
            }
        }
    }

    public List<RoomAvailableSlot> getRoomAvailableSlots() {
        return Collections.unmodifiableList(availableSlots);
    }
}
