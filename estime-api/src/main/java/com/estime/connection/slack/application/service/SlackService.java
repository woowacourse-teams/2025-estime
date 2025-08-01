package com.estime.connection.slack.application.service;

import com.estime.common.config.WebConfigProperties;
import com.estime.connection.application.dto.input.ConnectedRoomCreateMessageInput;
import com.estime.connection.domain.Platform;
import com.estime.connection.domain.PlatformCommand;
import com.estime.connection.slack.application.dto.SlackSlashCommandInput;
import com.estime.connection.slack.infrastructure.SlackMessageSender;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@RequiredArgsConstructor
public class SlackService {

    private static final String UNSUPPORTED_COMMAND_MESSAGE = "지원하지 않는 아인슈타임 슬랙 커맨드입니다.";

    private final WebConfigProperties webConfigProperties;
    private final SlackMessageSender slackMessageSender;

    public void handleSlashCommand(final SlackSlashCommandInput input) {
        if (PlatformCommand.CREATE.getCommandWithSlash().equals(input.command())) {
            final String url = generateConnectedRoomCreateUrl(input);
            final ConnectedRoomCreateMessageInput messageInput = new ConnectedRoomCreateMessageInput(url);
            slackMessageSender.sendConnectedRoomCreateEphemeralMessage(input.channelId(), input.userId(), messageInput);
        } else {
            slackMessageSender.sendTextMessage(input.channelId(), UNSUPPORTED_COMMAND_MESSAGE);
        }
    }

    private String generateConnectedRoomCreateUrl(final SlackSlashCommandInput input) {
        // TODO refactor with UTIL class
        return UriComponentsBuilder.fromUriString(webConfigProperties.dev())
                .queryParam("platform", Platform.SLACK.name())
                .queryParam("channelId", input.channelId())
                .build()
                .toUriString();
    }
}
