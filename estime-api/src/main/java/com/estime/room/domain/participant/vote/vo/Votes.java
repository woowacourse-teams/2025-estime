package com.estime.room.domain.participant.vote.vo;

import com.estime.room.domain.participant.vote.Vote;
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
                    .computeIfAbsent(element.getDateTimeSlot(), slot -> new HashSet<>())
                    .add(element.getParticipantId());
        }

        return statistic;
    }

    public Set<DateTimeSlot> calculateUniqueStartAts() {
        return elements.stream()
                .map(Vote::getDateTimeSlot)
                .collect(Collectors.toSet());
    }

//    public Votes findSlotsToSave(
//            final Set<DateTimeSlot> 삭제해야하는,
//            final Long roomId,
//            final Long userId
//    ) {
//        final Set<LocalDateTime> existingStartAts = calculateUniqueStartAts();
//        return new Votes(삭제해야하는.stream()
//                .filter(startAt -> !existingStartAts.contains(startAt))
//                .map(startAt -> DateTimeSlot.from(startAt))
//                .toList());
//    }
//
//    public Votes findSlotsToDelete(final Set<LocalDateTime> requestedStartAts) {
//        return new Votes(elements.stream()
//                .filter(timeSlot -> !requestedStartAts.contains(timeSlot.getStartAt()))
//                .toList());
//    }

    public boolean isEmpty() {
        return elements.isEmpty();
    }

    public boolean isNotEmpty() {
        return !isEmpty();
    }
}
