package com.estime.timepreference.presentation;

import com.estime.common.CustomApiResponse;
import com.estime.timepreference.application.TimePreferenceApplicationService;
import com.estime.timepreference.application.dto.TimePreferencesStatisticOutput;
import com.estime.timepreference.presentation.dto.TimePreferenceRequest;
import com.estime.timepreference.presentation.dto.TimePreferenceStatisticResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TimePreferenceController {

    private final TimePreferenceApplicationService timePreferenceApplicationService;

    @GetMapping("/api/v1/weekly-time-stats")
    public CustomApiResponse<TimePreferenceStatisticResponse> getWeeklyTimeStats(
            @RequestParam(defaultValue = "30") final int windowDays,
            @RequestParam(defaultValue = "3") final int topN,
            @RequestParam(required = false) final List<String> categories
    ) {
        final TimePreferencesStatisticOutput output = timePreferenceApplicationService.getTopTimePreferences(
                new TimePreferenceRequest(windowDays, topN, categories).toInput());

        final TimePreferenceStatisticResponse response =
                TimePreferenceStatisticResponse.of(output);

        return CustomApiResponse.ok(response);
    }
}
