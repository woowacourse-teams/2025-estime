package com.estime.room.domain.events;

import com.estime.event.DomainEvent;
import com.estime.room.domain.platform.PlatformType;
import com.estime.room.domain.vo.RoomSession;

import java.time.Instant;
import java.time.LocalDateTime;

public record ConnectedRoomCreatedDomainEvent(
        String channelId,
        RoomSession roomSession,
        String title,
        LocalDateTime roomDeadline,
        PlatformType platformType,
        Instant occurredAt
) implements DomainEvent {}
