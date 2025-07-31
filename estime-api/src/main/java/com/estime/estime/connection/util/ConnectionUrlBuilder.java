package com.estime.estime.connection.util;

import com.estime.estime.common.config.WebConfigProperties;
import com.estime.estime.connection.domain.Platform;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class ConnectionUrlBuilder {

    private final String baseUrl;

    public ConnectionUrlBuilder(final WebConfigProperties properties) {
        this.baseUrl = properties.prod();
    }

    public String buildConnectedRoomCreateUrl(final Platform platform, final String channelId) {
        return UriComponentsBuilder.fromUriString(baseUrl)
                .queryParam("platform", platform.name())
                .queryParam("channelId", channelId)
                .build()
                .toUriString();
    }

    public String buildConnectedRoomCreatedUrl(final String session) {
        return UriComponentsBuilder.fromUriString(baseUrl + "check")
                .queryParam("id", session)
                .build()
                .toUriString();
    }
}


