package com.estime.estime.connection.util;

import com.estime.estime.common.config.WebConfigProperties;
import com.estime.estime.connection.domain.Platform;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
@RequiredArgsConstructor
public class ConnectionUrlBuilder {

    private final WebConfigProperties webConfigProperties;

    public String buildConnectedRoomCreateUrl(final Platform platform, final String channelId) {
        return UriComponentsBuilder.fromUriString(webConfigProperties.prod())
                .queryParam("platform", platform.name())
                .queryParam("channelId", channelId)
                .build()
                .toUriString();
    }

    public String buildConnectedRoomCreatedUrl(final String session) {
        return UriComponentsBuilder.fromUriString(webConfigProperties.prod() + "check")
                .queryParam("id", session)
                .build()
                .toUriString();
    }
}
