package com.estime.connection.support;

import com.estime.common.config.WebConfigProperties;
import com.estime.connection.domain.Platform;
import com.estime.room.domain.vo.RoomSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
@RequiredArgsConstructor
public class ConnectionUrlHelper {

    private final WebConfigProperties webConfigProperties;

    public String buildConnectedRoomCreateUrl(final Platform platform, final String channelId) {
        return UriComponentsBuilder.fromUriString(webConfigProperties.prod())
                .queryParam("platform", platform.name())
                .queryParam("channelId", channelId)
                .build()
                .toUriString();
    }

    public String buildConnectedRoomCreatedUrl(final RoomSession session) {
        return UriComponentsBuilder.fromUriString(webConfigProperties.prod() + "check")
                .queryParam("id", session.getTsid().toString())
                .build()
                .toUriString();
    }
}
