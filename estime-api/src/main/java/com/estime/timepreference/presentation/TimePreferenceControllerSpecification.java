package com.estime.timepreference.presentation;

import com.estime.common.CustomApiResponse;
import com.estime.timepreference.presentation.dto.TimePreferenceStatisticResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "TimePreference", description = "시간 선호도 API")
@RequestMapping("/api/v1/time-preferences")
public interface TimePreferenceControllerSpecification {

    @Operation(summary = "시간 선호도 통계 조회")
    @GetMapping("/statistics")
    CustomApiResponse<TimePreferenceStatisticResponse> getTopTimePreferences(
            @Parameter(description = "조회 기간 (일, 1-365)", example = "30")
            @RequestParam(defaultValue = "30") int windowDays,
            @Parameter(description = "상위 N개 (1-100)", example = "3")
            @RequestParam(defaultValue = "3") int topN,
            @Parameter(description = "카테고리 필터", example = "[\"업무\", \"여가\", \"모임\", \"기타\"]")
            @RequestParam(required = false) List<String> categories
    );
}
