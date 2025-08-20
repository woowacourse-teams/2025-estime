package com.estime.room.infrastructure.platform;

import com.estime.common.config.ClientOriginProperties;
import com.estime.room.domain.platform.PlatformType;
import com.estime.room.domain.vo.RoomSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
@RequiredArgsConstructor
public class PlatformShortcutBuilder {

    private final ClientOriginProperties clientOriginProperties;

    public String buildConnectedRoomCreateUrl(final PlatformType type, final String channelId) {
        return UriComponentsBuilder.fromUriString(clientOriginProperties.prod())
                .queryParam("platformType", type.name())
                .queryParam("channelId", channelId)
                .build()
                .toUriString();
    }

    public String buildConnectedRoomCreatedUrl(final RoomSession session) {
        return UriComponentsBuilder.fromUriString(clientOriginProperties.prod() + "check")
                .queryParam("id", session.toString())
                .build()
                .toUriString();
    }
}
