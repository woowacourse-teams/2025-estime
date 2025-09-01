package com.estime.timepreference.domain.category;

import com.estime.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.Set;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "room_category", uniqueConstraints = {
        @UniqueConstraint(name = "uk_room_category_room_id", columnNames = "room_id")
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@ToString
public class RoomCategory extends BaseEntity {

    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @Column(name = "category", nullable = false)
    @Enumerated(EnumType.STRING)
    private CategoryType category;

    public static RoomCategory withoutId(
            final Long roomId,
            final CategoryType category
    ) {
        return new RoomCategory(roomId, category);
    }

    public boolean isInCategories(final Set<CategoryType> categories) {
        return categories.contains(this.category);
    }
}
