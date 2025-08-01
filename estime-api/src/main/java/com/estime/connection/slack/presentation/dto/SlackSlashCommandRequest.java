package com.estime.connection.slack.presentation.dto;

import com.estime.connection.slack.application.dto.SlackSlashCommandInput;

public record SlackSlashCommandRequest(
        String command,
        String channel_id,
        String user_id
) {

    public SlackSlashCommandInput toInput() {
        return new SlackSlashCommandInput(command, channel_id, user_id);
    }
}
