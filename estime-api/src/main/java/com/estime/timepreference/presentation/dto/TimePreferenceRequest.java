package com.estime.timepreference.presentation.dto;

import com.estime.common.exception.domain.InvalidRangeException;
import com.estime.timepreference.application.dto.TimePreferenceInput;
import com.estime.timepreference.domain.category.CategoryType;
import java.util.List;
import lombok.experimental.FieldNameConstants;

@FieldNameConstants
public record TimePreferenceRequest(
        int windowDays,
        int topN,
        List<String> category
) {

    public TimePreferenceRequest {
        if (windowDays < 1 || windowDays > 365) {
            throw new InvalidRangeException(Fields.windowDays, windowDays, 1, 365);
        }
        if (topN < 1 || topN > 100) {
            throw new InvalidRangeException(Fields.topN, topN, 1, 100);
        }
    }

    public TimePreferenceInput toInput() {
        return new TimePreferenceInput(windowDays, topN, CategoryType.fromOrAll(category));
    }
}
