package com.estime.room.converter;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.estime.exception.InvalidRoomSessionFormatException;
import com.estime.room.RoomSession;
import com.github.f4b6a3.tsid.TsidCreator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class StringToRoomSessionConverterTest {

    private final StringToRoomSessionConverter converter = new StringToRoomSessionConverter();

    @DisplayName("유효한 TSID 형식의 문자열을 RoomSession으로 변환한다")
    @Test
    void convert_validTsid() {
        // given
        final String validTsid = TsidCreator.getTsid().toString();

        // when
        final RoomSession result = converter.convert(validTsid);

        // then
        assertThat(result.getValue()).isEqualTo(validTsid);
    }

    @DisplayName("잘못된 형식의 문자열은 InvalidRoomSessionFormatException을 발생시킨다")
    @Test
    void convert_invalidFormat() {
        // given
        final String invalidFormat = "invalid-session-format";

        // when & then
        assertThatThrownBy(() -> converter.convert(invalidFormat))
                .isInstanceOf(InvalidRoomSessionFormatException.class);
    }

    @DisplayName("빈 문자열은 InvalidRoomSessionFormatException을 발생시킨다")
    @Test
    void convert_emptyString() {
        // given
        final String emptyString = "";

        // when & then
        assertThatThrownBy(() -> converter.convert(emptyString))
                .isInstanceOf(InvalidRoomSessionFormatException.class);
    }

    @DisplayName("null은 InvalidRoomSessionFormatException을 발생시킨다")
    @Test
    void convert_null() {
        // when & then
        assertThatThrownBy(() -> converter.convert(null))
                .isInstanceOf(InvalidRoomSessionFormatException.class);
    }
}
