package com.estime.room.participant.vote;

import com.estime.room.timeslot.DateTimeSlot;
import com.estime.shared.Validator;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@ToString
@EqualsAndHashCode
public class Vote {

    @EmbeddedId
    private VoteId id;

    public static Vote of(final Long participantId, final DateTimeSlot dateTimeSlot) {
        Validator.builder()
                .add("participantId", participantId)
                .add("dateTimeSlot", dateTimeSlot)
                .validateNull();
        return new Vote(VoteId.of(participantId, dateTimeSlot));
    }

    public Long participantId() {
        return id.getParticipantId();
    }

    public DateTimeSlot dateTimeSlot() {
        return id.getDateTimeSlot();
    }

    public LocalDateTime startAt() {
        return dateTimeSlot().getStartAt();
    }
}
