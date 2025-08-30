package com.estime.timepreference.domain.category;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum CategoryType {

    WORK("업무"),
    LEISURE("여가"),
    SOCIAL("모임"),
    ETC("기타");

    private final String displayName;

    public static CategoryType from(final String name) {
        for (final CategoryType categoryType : values()) {
            if (categoryType.displayName.equals(name)) {
                return categoryType;
            }
        }
        throw new IllegalArgumentException("Unknown category: " + name);
    }

    public static Set<CategoryType> fromOrAll(final List<String> names) {
        if (names == null || names.isEmpty()) {
            return Set.of(values());
        }
        return names.stream()
                .map(CategoryType::from)
                .collect(Collectors.toSet());
    }
}
