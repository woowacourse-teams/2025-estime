package com.estime.room.domain.participant.vote;

import com.estime.room.domain.vo.DateTimeSlot;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class Votes {

    private final List<Vote> elements;

    public static Votes from(final List<Vote> votes) {
        Objects.requireNonNull(votes, "votes cannot be null");
        return new Votes(List.copyOf(votes));
    }

    public Map<DateTimeSlot, Set<Long>> calculateStatistic() {
        final Map<DateTimeSlot, Set<Long>> statistic = new HashMap<>();
        for (final Vote element : elements) {
            statistic
                    .computeIfAbsent(DateTimeSlot.from(element.getId().getDateTimeSlot().getStartAt()),
                            slot -> new HashSet<>())
                    .add(element.getId().getParticipantId());
        }

        return statistic;
    }

    public Set<DateTimeSlot> calculateUniqueStartAts() {
        return elements.stream()
                .map(element -> element.getId().getDateTimeSlot())
                .collect(Collectors.toSet());
    }

    public boolean isEmpty() {
        return elements.isEmpty();
    }

    public boolean isNotEmpty() {
        return !isEmpty();
    }
}
