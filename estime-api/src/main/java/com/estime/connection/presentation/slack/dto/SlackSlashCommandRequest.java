package com.estime.connection.presentation.slack.dto;

import com.estime.connection.application.slack.dto.SlackSlashCommandInput;

public record SlackSlashCommandRequest(
        String command,
        String channel_id,
        String user_id
) {

    public SlackSlashCommandInput toInput() {
        return new SlackSlashCommandInput(command, channel_id, user_id);
    }
}
