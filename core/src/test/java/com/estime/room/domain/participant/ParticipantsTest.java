package com.estime.room.domain.participant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.SoftAssertions.assertSoftly;

import com.estime.exception.NullNotAllowedException;
import com.estime.domain.room.participant.Participant;
import com.estime.domain.room.participant.Participants;
import com.estime.domain.room.participant.ParticipantName;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

class ParticipantsTest {

    @Test
    @DisplayName("정적 팩토리 메소드 from으로 Participants를 생성한다.")
    void from() {
        //given
        Participant participant1 = Participant.withoutId(1L, ParticipantName.from("test1"));
        Participant participant2 = Participant.withoutId(1L, ParticipantName.from("test2"));
        List<Participant> participantList = List.of(participant1, participant2);

        //when
        Participants participants = Participants.from(participantList);

        //then
        assertSoftly(softly -> {
            softly.assertThat(participants.getValues()).hasSize(2);
            softly.assertThat(participants.getValues()).contains(participant1, participant2);
        });
    }

    @DisplayName("from 메소드에 null을 전달하면 예외가 발생한다.")
    @Test
    void from_withNull() {
        // given
        final List<Participant> nullList = null;

        // when & then
        assertThatThrownBy(() -> Participants.from(nullList))
                .isInstanceOf(NullNotAllowedException.class)
                .hasMessageContaining("cannot be null");
    }

    @DisplayName("getSize 메소드가 요소 수를 반환한다.")
    @Test
    void getSize() {
        // given
        ParticipantName name1 = ParticipantName.from("test1");
        ParticipantName name2 = ParticipantName.from("test2");
        Participant participant1 = Participant.withoutId(1L, name1);
        Participant participant2 = Participant.withoutId(1L, name2);
        Participants participants = Participants.from(List.of(participant1, participant2));

        // when & then
        assertThat(participants.getSize()).isEqualTo(2);
    }

    @DisplayName("getAllNames 메소드가 모든 participant 이름을 반환한다.")
    @Test
    void getAllNames() {
        // given
        ParticipantName name1 = ParticipantName.from("test1");
        ParticipantName name2 = ParticipantName.from("test2");
        Participant participant1 = Participant.withoutId(1L, name1);
        Participant participant2 = Participant.withoutId(1L, name2);
        Participants participants = Participants.from(List.of(participant1, participant2));

        // when
        List<ParticipantName> names = participants.getAllNames();

        // then
        assertSoftly(softly -> {
            softly.assertThat(names).hasSize(2);
            softly.assertThat(names).containsExactly(name1, name2);
        });
    }

    @DisplayName("getIdToName 메소드가 ID와 이름의 매핑을 반환한다.")
    @Test
    void getIdToName() {
        // given
        String name1 = "test1";
        String name2 = "test2";
        Participant participant1 = createParticipant(101L, 1L, name1);
        Participant participant2 = createParticipant(102L, 1L, name2);
        Participants participants = Participants.from(List.of(participant1, participant2));

        // when
        Map<Long, ParticipantName> map = participants.getIdToName();

        // then
        assertSoftly(softly -> {
            softly.assertThat(map).hasSize(2);
            softly.assertThat(map.get(101L).getValue()).isEqualTo(name1);
            softly.assertThat(map.get(102L).getValue()).isEqualTo(name2);
        });
    }

    private Participant createParticipant(Long id, Long roomId, String name) {
        Participant participant = Participant.withoutId(roomId, ParticipantName.from(name));
        ReflectionTestUtils.setField(participant, "id", id);
        return participant;
    }
}
