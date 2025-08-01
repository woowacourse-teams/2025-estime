package com.estime.room.domain.participant;

import com.estime.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.util.Objects;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@ToString
public class Participant extends BaseEntity {

    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "password", nullable = false, length = 8)
    private String password;

    public static Participant withoutId(
            final Long roomId,
            final String name,
            final String password
    ) {
        validate(roomId, name, password);
        return new Participant(roomId, name, password);
    }

    private static void validate(
            final Long roomId,
            final String userName,
            final String password
    ) {
        Objects.requireNonNull(roomId, "roomId cannot be null");
        Objects.requireNonNull(userName, "userName cannot be null");
        Objects.requireNonNull(password, "password cannot be null");
    }
}
