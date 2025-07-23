package com.bether.bether.connection.slack.application.service;

import com.bether.bether.connection.application.dto.input.ConnectedRoomCreateMessageInput;
import com.bether.bether.connection.domain.Platform;
import com.bether.bether.connection.domain.PlatformCommand;
import com.bether.bether.connection.slack.application.dto.SlackSlashCommandInput;
import com.bether.bether.connection.slack.application.util.SlackMessageBuilder;
import com.bether.bether.connection.slack.infrastructure.SlackMessageSender;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SlackService {

    private static final String DEFAULT_MESSAGE = "지원하지 않는 아인슈타임 슬랙 커맨드입니다.";

    @Value("${URL_ORIGIN_DEV}")
    private String baseUrl;

    private final SlackMessageSender slackMessageSender;
    private final SlackMessageBuilder slackMessageBuilder;

    public void handleSlashCommand(final SlackSlashCommandInput input) {
        if (PlatformCommand.CREATE.getCommandWithSlash().equals(input.command())) {
            String url = generateConnectedRoomCreateUrl(input);
            ConnectedRoomCreateMessageInput messageInput = new ConnectedRoomCreateMessageInput(url);
            slackMessageSender.execute(input.channelId(), slackMessageBuilder.buildRoomCreateBlocks(messageInput));
        } else {
            slackMessageSender.execute(input.channelId(), DEFAULT_MESSAGE);
        }
    }

    private String generateConnectedRoomCreateUrl(final SlackSlashCommandInput input) {
        return baseUrl + "?platform=" + Platform.SLACK.name().toLowerCase() + "&channelId=" + input.channelId();
    }
}
