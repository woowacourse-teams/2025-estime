package com.estime.timepreference.domain.category;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Set;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class RoomCategoryTest {

    @DisplayName("정상적인 값으로 RoomCategory 생성을 성공한다")
    @Test
    void createRoomCategory_success() {
        final RoomCategory roomCategory = RoomCategory.withoutId(1L, CategoryType.WORK);

        assertThat(roomCategory.getRoomId()).isEqualTo(1L);
        assertThat(roomCategory.getCategory()).isEqualTo(CategoryType.WORK);
    }

    @DisplayName("주어진 카테고리가 포함된 경우 true를 반환한다")
    @Test
    void contains_includedCategory_returnsTrue() {
        final RoomCategory roomCategory = RoomCategory.withoutId(1L, CategoryType.WORK);
        final Set<CategoryType> categories = Set.of(CategoryType.WORK, CategoryType.LEISURE);

        assertThat(roomCategory.contains(categories)).isTrue();
    }

    @DisplayName("주어진 카테고리가 포함되지 않은 경우 false를 반환한다")
    @Test
    void contains_notIncludedCategory_returnsFalse() {
        final RoomCategory roomCategory = RoomCategory.withoutId(1L, CategoryType.WORK);
        final Set<CategoryType> categories = Set.of(CategoryType.LEISURE, CategoryType.SOCIAL);

        assertThat(roomCategory.contains(categories)).isFalse();
    }
}