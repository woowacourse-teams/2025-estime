package com.estime.room.domain.participant;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.estime.common.DomainTerm;
import com.estime.common.exception.domain.InvalidLengthException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class ParticipantTest {

    @DisplayName("이름이 최대 길이(10)를 초과하면 InvalidLengthException이 발생한다")
    @Test
    void validateName_exceedMaxLength_throwsException() {
        // given
        String invalidName = "이름이너무길어서예외가발생합니다";

        // when & then
        assertThatThrownBy(() -> Participant.withoutId(1L, invalidName))
                .isInstanceOf(InvalidLengthException.class)
                .hasMessageContaining(DomainTerm.PARTICIPANT.name());
    }

    @DisplayName("이름이 최대 길이(10)와 같으면 예외가 발생하지 않는다")
    @Test
    void validateName_exactMaxLength_success() {
        // given
        String exactLengthName = "열글자이름입니다";

        // when & then
        assertThatCode(() -> Participant.withoutId(1L, exactLengthName))
                .doesNotThrowAnyException();
    }

    @DisplayName("이름이 빈 문자열이면 InvalidLengthException이 발생한다")
    @Test
    void validateName_blank_throwsException() {
        // given
        String blankName = "   ";

        // when & then
        assertThatThrownBy(() -> Participant.withoutId(1L, blankName))
                .isInstanceOf(InvalidLengthException.class)
                .hasMessageContaining(DomainTerm.PARTICIPANT.name());
    }
}
