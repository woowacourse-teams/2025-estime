package com.estime.room.infrastructure;

import com.estime.room.application.port.RoomForTimePreferenceQuery;
import com.estime.room.domain.QRoom;
import com.estime.room.domain.participant.QParticipant;
import com.estime.room.domain.participant.vote.QVote;
import com.estime.room.domain.slot.vo.DateSlot;
import com.estime.room.domain.slot.vo.DateTimeSlot;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RoomForTimePreferenceQueryJpaAdapter implements RoomForTimePreferenceQuery {

    private final QRoom room = QRoom.room;
    private final QParticipant participant = QParticipant.participant;
    private final QVote vote = QVote.vote;

    private final JPAQueryFactory queryFactory;

    @Override
    public List<RoomBriefForTimePreference> findBriefs(final LocalDate start, final LocalDate end) {
        return queryFactory
                .select(Projections.constructor(
                        RoomBriefForTimePreference.class,
                        room.id,
                        room.title))
                .from(room)
                .where(room.availableDateSlots.any().between(DateSlot.from(start), DateSlot.from(end)))
                .fetch();
    }

    @Override
    public List<VoteCountForTimePreference> findVoteCounts(
            final Collection<Long> roomIds,
            final LocalDate start,
            final LocalDate end
    ) {
        final DateTimeSlot startDateTimeSlot = DateTimeSlot.from(start.atStartOfDay());
        final DateTimeSlot endDateTimeSlot = DateTimeSlot.from(end.atStartOfDay().plusDays(1).minus(DateTimeSlot.UNIT));

        return queryFactory
                .select(Projections.constructor(
                        VoteCountForTimePreference.class,
                        vote.id.dateTimeSlot,
                        vote.count()
                ))
                .from(room)
                .join(participant).on(participant.roomId.eq(room.id))
                .join(vote).on(vote.id.participantId.eq(participant.id))
                .where(
                        room.id.in(roomIds),
                        vote.id.dateTimeSlot.between(startDateTimeSlot, endDateTimeSlot)
                )
                .groupBy(vote.id.dateTimeSlot)
                .fetch();
    }
}
