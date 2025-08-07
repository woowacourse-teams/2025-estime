package com.estime.room.domain.participant.vote;

import com.estime.common.DomainTerm;
import com.estime.common.exception.domain.DuplicateNotAllowedException;
import com.estime.common.exception.util.Validator;
import com.estime.room.domain.slot.vo.DateTimeSlot;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Votes {

    private final Set<Vote> elements;

    public static Votes from(final List<Vote> votes) {
        validateNull(votes);
        if (votes.size() != new HashSet<>(votes).size()) {
            throw new DuplicateNotAllowedException(DomainTerm.VOTES, votes);
        }
        return new Votes(Set.copyOf(votes));
    }

    private static void validateNull(final List<Vote> votes) {
        Validator.builder()
                .add("votes", votes)
                .validateNull();
    }

    public Votes subtract(final Votes votes) {
        final Set<Vote> removed = new HashSet<>(this.elements);
        removed.removeAll(votes.getElements());
        return new Votes(removed);
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

    public Set<Vote> getElements() {
        return Set.copyOf(elements);
    }
}
