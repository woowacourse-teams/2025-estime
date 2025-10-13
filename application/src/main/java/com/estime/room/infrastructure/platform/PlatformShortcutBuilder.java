package com.estime.room.infrastructure.platform;

import com.estime.common.config.ClientOriginProperties;
import com.estime.room.RoomSession;
import com.estime.room.platform.PlatformType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
@RequiredArgsConstructor
public class PlatformShortcutBuilder {

    private final ClientOriginProperties properties;

    public String buildConnectedRoomCreateUrl(final PlatformType type, final String channelId) {
        return UriComponentsBuilder.fromUriString(properties.client())
                .queryParam("platformType", type.name())
                .queryParam("channelId", channelId)
                .build()
                .toUriString();
    }

    public String buildConnectedRoomUrl(final RoomSession session) {
        return UriComponentsBuilder.fromUriString(properties.client())
                .path("check")
                .queryParam("id", session.toString())
                .build()
                .toUriString();
    }
}
