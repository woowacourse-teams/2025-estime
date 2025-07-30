package com.estime.estime.connection.util;

import com.estime.estime.common.config.WebConfigProperties;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class ConnectionUrlBuilder {

    private final String baseUrl;

    public ConnectionUrlBuilder(final WebConfigProperties webConfigProperties) {
        this.baseUrl = webConfigProperties.dev();
    }

    public String buildConnectedRoomCreateUrl(final String platform, final String channelId) {
        return UriComponentsBuilder.fromUriString(baseUrl)
                .queryParam("platform", platform)
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
