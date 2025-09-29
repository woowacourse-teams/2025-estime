package com.estime.room.domain.participant;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.estime.domain.DomainTerm;
import com.estime.exception.InvalidLengthException;
import com.estime.domain.room.participant.Participant;
import com.estime.domain.room.participant.ParticipantName;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class ParticipantTest {

    @DisplayName("이름이 최대 길이(12)와 같으면 예외가 발생하지 않는다")
    @Test
    void validateName_exactMaxLength_success() {
        // given
        ParticipantName exactLengthName = ParticipantName.from("열두글자이름입니다열두글");

        // when & then
        assertThatCode(() -> Participant.withoutId(1L, exactLengthName))
                .doesNotThrowAnyException();
    }

    @DisplayName("이름이 최대 길이(12)를 초과하면 InvalidLengthException이 발생한다")
    @Test
    void validateName_exceedMaxLength_throwsException() {
        // when & then
        assertThatThrownBy(() -> ParticipantName.from("이름이너무길어서예외가발생합니다"))
                .isInstanceOf(InvalidLengthException.class)
                .hasMessageContaining(DomainTerm.PARTICIPANT.name());
    }

    @DisplayName("이름이 빈 문자열이면 InvalidLengthException이 발생한다")
    @Test
    void validateName_blank_throwsException() {
        // when & then
        assertThatThrownBy(() -> ParticipantName.from("   "))
                .isInstanceOf(InvalidLengthException.class)
                .hasMessageContaining(DomainTerm.PARTICIPANT.name());
    }
}
