package com.estime.room.domain.participant.vote.vo;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class VoteId implements Serializable {

    private Long participantId;
    private DateTimeSlot dateTimeSlot;

    public static VoteId of(final Long participantId, final DateTimeSlot dateTimeSlot) {
        return new VoteId(participantId, dateTimeSlot);
    }

    @Override
    public boolean equals(final Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof final VoteId that)) {
            return false;
        }
        return Objects.equals(participantId, that.participantId) &&
                Objects.equals(dateTimeSlot, that.dateTimeSlot);
    }

    @Override
    public int hashCode() {
        return Objects.hash(participantId, dateTimeSlot);
    }
}
