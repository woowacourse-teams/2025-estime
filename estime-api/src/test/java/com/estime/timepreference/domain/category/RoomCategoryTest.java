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
    void isCategoryIn_included_returnsTrueCategories() {
        final RoomCategory roomCategory = RoomCategory.withoutId(1L, CategoryType.WORK);
        final Set<CategoryType> categories = Set.of(CategoryType.WORK, CategoryType.LEISURE);

        assertThat(roomCategory.isInCategories(categories)).isTrue();
    }

    @DisplayName("주어진 카테고리가 포함되지 않은 경우 false를 반환한다")
    @Test
    void isCategoryIn_notIncluded_returnsFalseCategories() {
        final RoomCategory roomCategory = RoomCategory.withoutId(1L, CategoryType.WORK);
        final Set<CategoryType> categories = Set.of(CategoryType.LEISURE, CategoryType.SOCIAL);

        assertThat(roomCategory.isInCategories(categories)).isFalse();
    }
}
