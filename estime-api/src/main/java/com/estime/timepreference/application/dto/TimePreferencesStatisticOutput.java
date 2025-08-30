package com.estime.timepreference.application.dto;

import com.estime.timepreference.domain.category.CategoryType;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record TimePreferencesStatisticOutput(
        LocalDate startDate,
        LocalDate endDate,
        List<TimePreferencesOutput> timePreferencesOutputs
) {

    public record TimePreferencesOutput(
            CategoryType category,
            List<TimePreferenceOutput> timePreferences
    ) {
    }

    public record TimePreferenceOutput(
            DayOfWeek dayOfWeek,
            LocalTime time,
            long count
    ) {
    }
}
