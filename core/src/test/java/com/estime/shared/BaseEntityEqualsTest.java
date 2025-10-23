package com.estime.shared;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.estime.room.Room;
import com.estime.room.participant.Participant;
import java.lang.reflect.Field;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class BaseEntityEqualsTest {

    @Test
    @DisplayName("서로 다른 타입이면 id가 같아도 동등하지 않다")
    void fixedImplementation_differentTypes_sameId_shouldNotBeEqual() throws Exception {
        // Given: Room과 Participant 인스턴스를 생성하고, 둘 다 id=1로 설정
        final Room room = createRoomWithId(1L);
        final Participant participant = createParticipantWithId(1L);

        // When
        final boolean result = room.equals(participant);

        // Then
        assertThat(result).isFalse();

        // 역방향
        assertThat(participant.equals(room)).isFalse();
    }

    @Test
    @DisplayName("현재 equals 구현: 같은 타입이고 같은 id면 동등하다 (올바른 동작)")
    void currentImplementation_sameType_sameId_shouldBeEqual() throws Exception {
        // Given: 같은 타입의 인스턴스 2개, 같은 id
        final Room room1 = createRoomWithId(1L);
        final Room room2 = createRoomWithId(1L);

        // When & Then: 같은 타입이므로 동등해야 함
        assertThat(room1.equals(room2)).isTrue();
    }

    @Test
    @DisplayName("같은 타입이지만 다른 id면 동등하지 않다")
    void currentImplementation_sameType_differentId_shouldNotBeEqual() throws Exception {
        // Given: 같은 타입의 인스턴스 2개, 다른 id
        final Room room1 = createRoomWithId(1L);
        final Room room2 = createRoomWithId(2L);

        // When & Then: id가 다르므로 동등하지 않아야 함
        assertThat(room1.equals(room2)).isFalse();
    }

    @Test
    @DisplayName("동등한 객체는 같은 hashCode를 가져야 한다")
    void hashCodeContract_equalObjects_sameHashCode() throws Exception {
        // Given: 같은 타입, 같은 id
        final Room room1 = createRoomWithId(1L);
        final Room room2 = createRoomWithId(1L);

        // When: equals는 true
        assertThat(room1.equals(room2)).isTrue();

        // Then: hashCode도 같아야 함 (계약 준수)
        assertThat(room1.hashCode()).isEqualTo(room2.hashCode());
    }

    @Test
    @DisplayName("hashCode with null id: 예외를 던진다")
    void hashCode_withNullId_throw_ISE() throws Exception {
        // Given: id가 null인 엔티티
        final Room room = createRoomWithId(null);

        // When & Then
        assertThatThrownBy(room::hashCode)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("hashCode() called on entity without ID");
    }

    private Room createRoomWithId(final Long id) throws Exception {
        final var constructor = Room.class.getDeclaredConstructor();
        constructor.setAccessible(true);
        final Room room = constructor.newInstance();
        setId(room, id);
        return room;
    }

    private Participant createParticipantWithId(final Long id) throws Exception {
        final var constructor = Participant.class.getDeclaredConstructor();
        constructor.setAccessible(true);
        final Participant participant = constructor.newInstance();
        setId(participant, id);
        return participant;
    }

    private void setId(final BaseEntity entity, final Long id) throws Exception {
        final Field idField = BaseEntity.class.getDeclaredField("id");
        idField.setAccessible(true);
        idField.set(entity, id);
    }
}
