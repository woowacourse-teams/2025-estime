package com.estime.timepreference.application.dto;

import com.estime.timepreference.domain.category.CategoryType;
import java.util.Collection;
import java.util.List;
import java.util.Set;

public record TimePreferenceInput(
        int windowDays,
        int topN,
        Set<CategoryType> categories
) {
}
