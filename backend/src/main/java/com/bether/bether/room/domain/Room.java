package com.bether.bether.room.domain;

import com.bether.bether.common.BaseEntity;
import jakarta.persistence.Entity;
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

    private UUID session;

    private Room(final UUID session) {
        this.session = session;
    }

    private Room(final Long id, final UUID session) {
        super(id);
        this.session = session;
    }

    public static Room withoutId(final UUID session) {
        validate(session);
        return new Room(session);
    }

    public static Room withId(final Long id, final UUID session) {
        validate(id, session);
        return new Room(id, session);
    }

    private static void validate(final Long id, final UUID session) {
        if (id == null) {
            throw new IllegalArgumentException("id cannot be null");
        }
        validate(session);
    }

    private static void validate(final UUID session) {
        if (session == null) {
            throw new IllegalArgumentException("session cannot be null");
        }
    }
}
