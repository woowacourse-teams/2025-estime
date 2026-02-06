package com.estime.room;

import com.estime.room.exception.DeadlineOverdueException;
import com.estime.room.exception.PastNotAllowedException;
import com.estime.room.participant.vote.exception.DuplicateNotAllowedException;
import com.estime.room.slot.CompactDateTimeSlot;
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
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
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
    private LocalDateTime deadline;

    @OneToMany(
            mappedBy = RoomAvailableSlot.Fields.room,
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<RoomAvailableSlot> availableSlots = new ArrayList<>();

    private Room(
            final RoomSession session,
            final String title,
            final LocalDateTime deadline,
            final List<CompactDateTimeSlot> slotCodes
    ) {
        this.session = session;
        this.title = title;
        this.deadline = deadline;
        slotCodes.forEach(slotCode -> this.availableSlots.add(RoomAvailableSlot.of(slotCode, this)));
    }

    public static Room withoutId(
            final String title,
            final RoomSession session,
            final LocalDateTime deadline,
            final List<CompactDateTimeSlot> slotCodes
    ) {
        validateNull(title, session, deadline, slotCodes);
        final String trimmedTitle = title.trim();
        validateTitle(trimmedTitle);
        validateDeadline(deadline);
        validateSlotCodesNoDuplicate(slotCodes);
        return new Room(session, trimmedTitle, deadline, slotCodes);
    }

    private static void validateNull(
            final String title,
            final RoomSession session,
            final LocalDateTime deadline,
            final List<CompactDateTimeSlot> slotCodes
    ) {
        Validator.builder()
                .add(Fields.title, title)
                .add(Fields.session, session)
                .add(Fields.deadline, deadline)
                .add(Fields.availableSlots, slotCodes)
                .validateNull();
    }

    private static void validateTitle(final String trimmedTitle) {
        if (trimmedTitle.isBlank() || trimmedTitle.length() > TITLE_MAX_LENGTH) {
            throw new InvalidLengthException(DomainTerm.ROOM, trimmedTitle);
        }
    }

    private static void validateDeadline(final LocalDateTime deadline) {
        if (deadline.isBefore(LocalDateTime.now())) {
            throw new PastNotAllowedException(DomainTerm.DEADLINE, deadline);
        }
    }

    private static void validateSlotCodesNoDuplicate(final List<CompactDateTimeSlot> slotCodes) {
        if (new HashSet<>(slotCodes).size() != slotCodes.size()) {
            throw new DuplicateNotAllowedException(DomainTerm.DATE_TIME_SLOT, slotCodes);
        }
    }

    public List<RoomAvailableSlot> getRoomAvailableSlots() {
        return Collections.unmodifiableList(availableSlots);
    }

    public void ensureDeadlineNotPassed(final LocalDateTime currentDateTime) {
        if (deadline.isBefore(currentDateTime)) {
            throw new DeadlineOverdueException(session, deadline, currentDateTime);
        }
    }

    public Instant getDeadline(final ZoneId zoneId) {
        return deadline.atZone(zoneId).toInstant();
    }
}
