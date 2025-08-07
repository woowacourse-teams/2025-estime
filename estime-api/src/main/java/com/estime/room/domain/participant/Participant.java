package com.estime.room.domain.participant;

import com.estime.common.BaseEntity;
import com.estime.common.util.Validator;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
public class Participant extends BaseEntity {

    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @Column(name = "name", nullable = false)
    private String name;

    public static Participant withoutId(
            final Long roomId,
            final String name
    ) {
        validateNull(roomId, name);
        return new Participant(roomId, name);
    }

    private static void validateNull(final Long roomId, final String name) {
        Validator.builder()
                .add("roomId", roomId)
                .add("name", name)
                .validateNull();
    }
}
