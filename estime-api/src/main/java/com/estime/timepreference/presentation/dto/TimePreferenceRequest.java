package com.estime.timepreference.presentation.dto;

import com.estime.timepreference.application.dto.TimePreferenceInput;
import com.estime.timepreference.domain.category.CategoryType;
import java.util.List;

public record TimePreferenceRequest(
        int windowDays,
        int topN,
        List<String> category
) {

    public TimePreferenceRequest {
        if (windowDays <= 0) {
            windowDays = 30;
        }
        if (topN <= 0) {
            topN = 3;
        }
    }

    public TimePreferenceInput toInput() {
        return new TimePreferenceInput(windowDays, topN, CategoryType.fromOrAll(category));
    }
}
