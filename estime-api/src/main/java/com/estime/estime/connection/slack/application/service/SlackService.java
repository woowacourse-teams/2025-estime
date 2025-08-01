package com.estime.estime.connection.slack.application.service;

import com.estime.estime.connection.application.dto.input.ConnectedRoomCreateMessageInput;
import com.estime.estime.connection.domain.Platform;
import com.estime.estime.connection.domain.PlatformCommand;
import com.estime.estime.connection.slack.application.dto.SlackSlashCommandInput;
import com.estime.estime.connection.slack.infrastructure.SlackMessageSender;
import com.estime.estime.connection.support.ConnectionUrlHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SlackService {

    private static final String UNSUPPORTED_COMMAND_MESSAGE = "지원하지 않는 아인슈타임 슬랙 커맨드입니다.";

    private final ConnectionUrlHelper connectionUrlHelper;
    private final SlackMessageSender slackMessageSender;

    public void handleSlashCommand(final SlackSlashCommandInput input) {
        final String command = input.command();
        if (!PlatformCommand.exists(command)) {
            slackMessageSender.sendTextMessage(input.channelId(), UNSUPPORTED_COMMAND_MESSAGE);
            return;
        }

        if (PlatformCommand.CREATE.getCommandWithSlash().equals(command)) {
            handleCreateCommand(input);
        } else {
            slackMessageSender.sendTextMessage(input.channelId(), UNSUPPORTED_COMMAND_MESSAGE);
        }
    }

    private void handleCreateCommand(final SlackSlashCommandInput input) {
        final String shortcut = getConnectedRoomCreateUrl(input);
        final ConnectedRoomCreateMessageInput messageInput = new ConnectedRoomCreateMessageInput(shortcut);
        slackMessageSender.sendConnectedRoomCreateEphemeralMessage(
                input.channelId(),
                input.userId(),
                messageInput
        );
    }

    private String getConnectedRoomCreateUrl(final SlackSlashCommandInput input) {
        return connectionUrlHelper.buildConnectedRoomCreateUrl(Platform.SLACK, input.channelId());
    }
}
