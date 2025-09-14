package com.estime.room.domain.participant;

import com.estime.common.BaseEntity;
import com.estime.common.util.Validator;
import com.estime.room.domain.participant.infrastructure.converter.ParticipantNameConverter;
import com.estime.room.domain.participant.vo.ParticipantName;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.FieldNameConstants;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@ToString
@FieldNameConstants
public class Participant extends BaseEntity {

    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @Column(name = "name", nullable = false)
    @Convert(converter = ParticipantNameConverter.class)
    private ParticipantName name;

    public static Participant withoutId(
            final Long roomId,
            final ParticipantName name
    ) {
        validateNull(roomId, name);
        return new Participant(roomId, name);
    }

    static Participant withId(
            final Long id,
            final Long roomId,
            final ParticipantName name
    ) {
        validateNull(id, roomId, name);
        final Participant participant = new Participant(roomId, name);
        participant.id = id;
        return participant;
    }


    private static void validateNull(final Long roomId, final ParticipantName name) {
        Validator.builder()
                .add(Fields.roomId, roomId)
                .add(Fields.name, name)
                .validateNull();
    }

    private static void validateNull(final Long id, final Long roomId, final ParticipantName name) {
        Validator.builder()
                .add(BaseEntity.Fields.id, id)
                .add(Fields.roomId, roomId)
                .add(Fields.name, name)
                .validateNull();
    }
}
