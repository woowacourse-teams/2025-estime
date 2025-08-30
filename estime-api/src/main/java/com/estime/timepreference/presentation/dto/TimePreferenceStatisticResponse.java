package com.estime.timepreference.presentation.dto;

import com.estime.timepreference.application.dto.TimePreferencesStatisticOutput;
import com.estime.timepreference.application.dto.TimePreferencesStatisticOutput.TimePreferenceOutput;
import com.estime.timepreference.application.dto.TimePreferencesStatisticOutput.TimePreferencesOutput;
import com.estime.timepreference.domain.TimeZoneConstants;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public record TimePreferenceStatisticResponse(
        String timeZone,
        Period period,
        List<CategoryTop> results
) {

    public static TimePreferenceStatisticResponse of(
            final TimePreferencesStatisticOutput output
    ) {

        final List<CategoryTop> tops = new ArrayList<>();

        for (final TimePreferencesOutput a : output.timePreferencesOutputs()) {

            final List<TimeSlotCount> counts = new ArrayList<>();

            for (final TimePreferenceOutput e : a.timePreferences()) {
                counts.add(
                        new TimeSlotCount(
                                e.dayOfWeek().getDisplayName(TextStyle.SHORT, Locale.KOREA),
                                e.time(),
                                e.count()));
            }

            tops.add(new CategoryTop(a.category().getDisplayName(), counts));

        }

        return new TimePreferenceStatisticResponse(
                TimeZoneConstants.ASIA_SEOUL_STRING,
                new Period(output.startDate(), output.endDate()),
                tops
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
