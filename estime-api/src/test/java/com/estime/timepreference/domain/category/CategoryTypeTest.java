package com.estime.timepreference.domain.category;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class CategoryTypeTest {

    @DisplayName("유효한 displayName으로 CategoryType을 찾는다")
    @Test
    void from_validDisplayName_returnsCategoryType() {
        assertThat(CategoryType.from("업무")).isEqualTo(CategoryType.WORK);
        assertThat(CategoryType.from("여가")).isEqualTo(CategoryType.LEISURE);
        assertThat(CategoryType.from("모임")).isEqualTo(CategoryType.SOCIAL);
        assertThat(CategoryType.from("기타")).isEqualTo(CategoryType.ETC);
    }

    @DisplayName("유효하지 않은 displayName으로 예외가 발생한다")
    @Test
    void from_invalidDisplayName_throwsException() {
        assertThatThrownBy(() -> CategoryType.from("존재하지않음"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Unknown category: 존재하지않음");
    }

    @DisplayName("이름 목록이 비어있거나 null이면 모든 CategoryType을 반환한다")
    @Test
    void fromOrAll_emptyOrNullList_returnsAll() {
        assertThat(CategoryType.fromOrAll(null))
                .containsExactlyInAnyOrder(
                        CategoryType.WORK,
                        CategoryType.LEISURE,
                        CategoryType.SOCIAL,
                        CategoryType.ETC);

        assertThat(CategoryType.fromOrAll(List.of()))
                .containsExactlyInAnyOrder(CategoryType.WORK,
                        CategoryType.LEISURE,
                        CategoryType.SOCIAL,
                        CategoryType.ETC);
    }

    @DisplayName("유효한 이름 목록으로 해당 CategoryType들을 반환한다")
    @Test
    void fromOrAll_validNames_returnsCategoryTypes() {
        final List<String> names = List.of("업무", "여가");
        final Set<CategoryType> result = CategoryType.fromOrAll(names);

        assertThat(result).containsExactly(CategoryType.WORK, CategoryType.LEISURE);
    }
}
