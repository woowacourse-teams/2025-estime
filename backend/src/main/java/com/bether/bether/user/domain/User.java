package com.bether.bether.user.domain;

import com.bether.bether.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
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
public class User extends BaseEntity {

    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "password", nullable = false, length = 8)
    private String password;

    public static User withoutId(final Long roomId, final String name, final String password) {
        validate(roomId, name, password);
        return new User(roomId, name, password);
    }

    private static void validate(final Long roomId, final String userName, final String password) {
        if (roomId == null || userName == null || password == null) {
            throw new IllegalArgumentException("roomId, userName, password cannot be null");
        }
    }
}
