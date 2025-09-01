package com.estime.timepreference.presentation.dto;

import com.estime.timepreference.application.dto.TimePreferencesStatisticOutput;
import com.estime.timepreference.application.dto.TimePreferencesStatisticOutput.TimePreferenceOutput;
import com.estime.timepreference.application.dto.TimePreferencesStatisticOutput.TimePreferencesOutput;
import com.estime.timepreference.domain.TimeZoneConstants;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

public record TimePreferenceStatisticResponse(
        String timeZone,
        Period period,
        List<CategoryTop> results
) {

    public static TimePreferenceStatisticResponse of(final TimePreferencesStatisticOutput output) {
        return new TimePreferenceStatisticResponse(
                TimeZoneConstants.ASIA_SEOUL.toString(),
                new Period(output.startDate(), output.endDate()),
                convertToCategoryTops(output.timePreferencesOutputs())
        );
    }

    private static List<CategoryTop> convertToCategoryTops(final List<TimePreferencesOutput> outputs) {
        return outputs.stream()
                .map(TimePreferenceStatisticResponse::convertToCategoryTop)
                .toList();
    }

    private static CategoryTop convertToCategoryTop(final TimePreferencesOutput output) {
        return new CategoryTop(
                output.category().getDisplayName(),
                convertToTimeSlotCounts(output.timePreferences())
        );
    }

    private static List<TimeSlotCount> convertToTimeSlotCounts(final List<TimePreferenceOutput> preferences) {
        return preferences.stream()
                .map(TimePreferenceStatisticResponse::convertToTimeSlotCount)
                .toList();
    }

    private static TimeSlotCount convertToTimeSlotCount(final TimePreferenceOutput preference) {
        return new TimeSlotCount(
                preference.dayOfWeek().getDisplayName(TextStyle.SHORT, Locale.KOREA),
                preference.time(),
                preference.count()
        );
    }

    private record Period(
            @JsonFormat(pattern = "yyyy-MM-dd")
            LocalDate start,

            @JsonFormat(pattern = "yyyy-MM-dd")
            LocalDate end
    ) {
    }

    private record CategoryTop(
            String category,
            List<TimeSlotCount> top
    ) {
    }

    private record TimeSlotCount(
            String dayOfWeek,

            @JsonFormat(pattern = "HH:mm")
            LocalTime time,

            long count
    ) {
    }
}
