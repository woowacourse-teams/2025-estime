package com.estime.timepreference.application;

import com.estime.room.application.port.RoomForTimePreferenceQuery;
import com.estime.room.application.port.RoomForTimePreferenceQuery.RoomBriefForTimePreference;
import com.estime.room.application.port.RoomForTimePreferenceQuery.VoteCountForTimePreference;
import com.estime.timepreference.application.dto.TimePreferenceInput;
import com.estime.timepreference.application.dto.TimePreferencesStatisticOutput;
import com.estime.timepreference.application.dto.TimePreferencesStatisticOutput.TimePreferenceOutput;
import com.estime.timepreference.application.dto.TimePreferencesStatisticOutput.TimePreferencesOutput;
import com.estime.timepreference.domain.TimeZoneConstants;
import com.estime.timepreference.domain.category.CategoryType;
import com.estime.timepreference.domain.category.RoomCategory;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TimePreferenceApplicationService {

    private final RoomForTimePreferenceQuery roomForTimePreferenceQuery;
    private final RoomCategoryApplicationService roomCategoryApplicationService;

    @Transactional(readOnly = true)
    public TimePreferencesStatisticOutput getTopTimePreferences(final TimePreferenceInput input) {
        final LocalDate endDate = LocalDate.now(TimeZoneConstants.ASIA_SEOUL);
        final LocalDate startDate = endDate.minusDays(input.windowDays() - 1);

        final List<RoomBriefForTimePreference> roomBriefs =
                roomForTimePreferenceQuery.findBriefs(startDate, endDate);

        final Map<Long, String> titleByRoomId = roomBriefs.stream()
                .collect(Collectors.toMap(
                        RoomBriefForTimePreference::roomId,
                        RoomBriefForTimePreference::title));

        final List<RoomCategory> roomCategories = roomCategoryApplicationService.classifyRooms(titleByRoomId);

        final Map<CategoryType, List<Long>> roomIdsByCategory = roomCategories.stream()
                .filter(each -> each.isInCategories(input.categories()))
                .collect(Collectors.groupingBy(
                        RoomCategory::getCategory,
                        Collectors.mapping(
                                RoomCategory::getRoomId,
                                Collectors.toList())
                ));

        final List<TimePreferencesOutput> outputs = roomIdsByCategory.entrySet().stream()
                .map(entry ->
                        createTimePreferencesOutput(
                                entry.getKey(),
                                entry.getValue(),
                                startDate,
                                endDate,
                                input.topN()))
                .toList();

        return new TimePreferencesStatisticOutput(startDate, endDate, outputs);
    }

    private TimePreferencesOutput createTimePreferencesOutput(
            final CategoryType category,
            final List<Long> roomIds,
            final LocalDate startDate,
            final LocalDate endDate,
            final int topN
    ) {
        final List<VoteCountForTimePreference> voteCounts = roomForTimePreferenceQuery.findVoteCounts(
                roomIds, startDate, endDate);

        final Map<Entry<DayOfWeek, LocalTime>, Long> countByTime = voteCounts.stream()
                .collect(Collectors.groupingBy(
                        voteCount ->
                                Map.entry(
                                        voteCount.dateTime().getDayOfWeek(),
                                        voteCount.dateTime().toLocalTime()),
                        Collectors.summingLong(VoteCountForTimePreference::count)
                ));

        final List<TimePreferenceOutput> timePreferences = countByTime.entrySet().stream()
                .sorted(Entry.comparingByValue(Comparator.reverseOrder()))
                .limit(topN)
                .map(timeEntry ->
                        new TimePreferenceOutput(
                                timeEntry.getKey().getKey(),
                                timeEntry.getKey().getValue(),
                                timeEntry.getValue()))
                .toList();

        return new TimePreferencesOutput(category, timePreferences);
    }
}
