package com.estime.room.domain.participant;

import com.estime.common.BaseEntity;
import com.estime.common.util.Validator;
import com.estime.room.domain.participant.vo.ParticipantName;
import com.estime.room.infrastructure.converter.ParticipantNameConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
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
@Table(indexes = {
        @Index(name = "idx_participant_room_id", columnList = "room_id")
})
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

    private static void validateNull(final Long roomId, final ParticipantName name) {
        Validator.builder()
                .add(Fields.roomId, roomId)
                .add(Fields.name, name)
                .validateNull();
    }
}
