package com.estime.room.participant.vote.compact;

import com.estime.room.participant.vote.exception.DuplicateNotAllowedException;
import com.estime.room.slot.CompactDateTimeSlot;
import com.estime.shared.DomainTerm;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.*;
import java.util.stream.Collectors;

@EqualsAndHashCode
@ToString
public class CompactVotes {

    private final Set<CompactVote> votes;

    private CompactVotes(final Set<CompactVote> votes) {
        this.votes = votes;
    }

    public static CompactVotes from(final Set<CompactVote> votes) {
        validateDuplicate(votes);
        return new CompactVotes(new HashSet<>(votes));
    }

    public static CompactVotes from(final List<CompactVote> votes) {
        return from(new HashSet<>(votes));
    }

    public static CompactVotes empty() {
        return new CompactVotes(new HashSet<>());
    }

    private static void validateDuplicate(final Set<CompactVote> votes) {
        final long uniqueCount = votes.stream()
                .map(CompactVote::dateTimeSlot)
                .distinct()
                .count();
        if (uniqueCount != votes.size()) {
            throw new DuplicateNotAllowedException(DomainTerm.VOTES);
        }
    }

    public CompactVotes subtract(final CompactVotes other) {
        final Set<CompactVote> removed = new HashSet<>(this.elements);
        removed.removeAll(other.elements);
        return new CompactVotes(removed);
    }

    public Map<CompactDateTimeSlot, Set<Long>> calculateStatistic() {
        return votes.stream()
                .collect(Collectors.groupingBy(
                        CompactVote::dateTimeSlot,
                        Collectors.mapping(CompactVote::participantId, Collectors.toSet())
                ));
    }

    public Set<CompactDateTimeSlot> calculateUniqueStartAts() {
        return votes.stream()
                .map(CompactVote::dateTimeSlot)
                .collect(Collectors.toSet());
    }

    public List<CompactVote> getSortedVotes() {
        return votes.stream()
                .sorted(Comparator.comparing(CompactVote::dateTimeSlot))
                .toList();
    }

    public Set<CompactVote> getVotes() {
        return new HashSet<>(votes);
    }

    public List<CompactVoteId> getVoteIds() {
        return votes.stream()
                .map(CompactVote::getId)
                .toList();
    }

    public int size() {
        return votes.size();
    }

    public boolean isEmpty() {
        return votes.isEmpty();
    }
}
