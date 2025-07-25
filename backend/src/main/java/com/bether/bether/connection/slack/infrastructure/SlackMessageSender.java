package com.bether.bether.connection.slack.infrastructure;

import com.bether.bether.connection.application.MessageSender;
import com.bether.bether.connection.application.dto.input.ConnectedRoomCreateMessageInput;
import com.bether.bether.connection.application.dto.input.ConnectedRoomCreatedMessageInput;
import com.bether.bether.connection.slack.application.util.SlackMessageBuilder;
import com.bether.bether.connection.slack.config.SlackBotProperties;
import com.slack.api.Slack;
import com.slack.api.methods.SlackApiException;
import com.slack.api.methods.request.chat.ChatPostEphemeralRequest;
import com.slack.api.methods.request.chat.ChatPostMessageRequest;
import com.slack.api.methods.response.chat.ChatPostEphemeralResponse;
import com.slack.api.methods.response.chat.ChatPostMessageResponse;
import com.slack.api.model.block.LayoutBlock;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component("SLACK")
@RequiredArgsConstructor
@Slf4j
public class SlackMessageSender implements MessageSender {

    private final Slack slack;
    private final SlackBotProperties slackProps;
    private final SlackMessageBuilder slackMessageBuilder;

    @Override
    public void sendTextMessage(final String channelId, final String message) {
        final ChatPostMessageRequest request = ChatPostMessageRequest.builder()
                .channel(channelId)
                .text(message)
                .build();

        sendSlackMessage(request, "Slack message", "Slack API error");
    }

    @Override
    public void sendConnectedRoomCreatedMessage(final String channelId, final ConnectedRoomCreatedMessageInput input) {
        final List<LayoutBlock> blocks = slackMessageBuilder.buildConnectedRoomCreatedBlocks(input);
        final ChatPostMessageRequest request = ChatPostMessageRequest.builder()
                .channel(channelId)
                .blocks(blocks)
                .build();

        sendSlackMessage(request, "Connected room created message", "Connected room created message");
    }

    public void sendConnectedRoomCreateEphemeralMessage(
            final String channelId,
            final String userId,
            final ConnectedRoomCreateMessageInput input
    ) {
        final List<LayoutBlock> blocks = slackMessageBuilder.buildConnectedRoomCreateBlocks(input);
        final ChatPostEphemeralRequest request = ChatPostEphemeralRequest.builder()
                .channel(channelId)
                .user(userId)
                .blocks(blocks)
                .text("Slack Ephemeral Message")
                .build();

        sendSlackEphemeralMessage(request, "Connected room create ephemeral message",
                "Connected room create ephemeral message");
    }

    private void sendSlackMessage(
            final ChatPostMessageRequest request,
            final String successLogPrefix,
            final String failLogPrefix
    ) {
        try {
            final ChatPostMessageResponse response = slack.methods(slackProps.token())
                    .chatPostMessage(request);

            if (response.isOk()) {
                log.info("{} sent: channel={}, ts={}", successLogPrefix, response.getChannel(), response.getTs());
            } else {
                log.warn("{} failed: {}", failLogPrefix, response.getError());
            }
        } catch (final SlackApiException e) {
            log.error("Slack API exception during {}: {}", failLogPrefix, e.getError(), e);
        } catch (final IOException e) {
            log.error("I/O error during {}: {}", failLogPrefix, e.getMessage(), e);
        }
    }

    private void sendSlackEphemeralMessage(final ChatPostEphemeralRequest request, final String successLogPrefix,
                                           final String failLogPrefix) {
        try {
            final ChatPostEphemeralResponse response = slack.methods(slackProps.token())
                    .chatPostEphemeral(request);

            if (response.isOk()) {
                log.info("{} sent: channel={}, ts={}", successLogPrefix, response.getChannel(),
                        response.getMessageTs());
            } else {
                log.warn("{} failed: {}", failLogPrefix, response.getError());
            }
        } catch (final SlackApiException e) {
            log.error("Slack API exception during {}: {}", failLogPrefix, e.getError(), e);
        } catch (final IOException e) {
            log.error("I/O error during {}: {}", failLogPrefix, e.getMessage(), e);
        }
    }
}
