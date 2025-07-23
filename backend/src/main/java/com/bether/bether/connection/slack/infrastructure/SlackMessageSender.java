package com.bether.bether.connection.slack.infrastructure;

import com.bether.bether.connection.application.MessageSender;
import com.bether.bether.connection.slack.config.SlackBotProperties;
import com.slack.api.Slack;
import com.slack.api.methods.SlackApiException;
import com.slack.api.methods.request.chat.ChatPostMessageRequest;
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

    @Override
    public void execute(final String channelId, final String message) {
        try {
            final ChatPostMessageRequest request = ChatPostMessageRequest.builder()
                    .channel(channelId)
                    .text(message)
                    .build();

            final ChatPostMessageResponse response = slack.methods(slackProps.token())
                    .chatPostMessage(request);

            if (response.isOk()) {
                log.info("Slack message sent: channel={}, ts={}", response.getChannel(), response.getTs());
            } else {
                log.warn("Slack API error: {}", response.getError());
            }
        } catch (final SlackApiException e) {
            log.error("Slack API exception: {}", e.getError(), e);
        } catch (final IOException e) {
            log.error("I/O error sending Slack message", e);
        }
    }

    public void execute(final String channelId, final List<LayoutBlock> blocks) {
        try {
            final ChatPostMessageRequest request = ChatPostMessageRequest.builder()
                    .channel(channelId)
                    .blocks(blocks)
                    .text("Slack Block Message")
                    .build();

            final ChatPostMessageResponse response = slack.methods(slackProps.token())
                    .chatPostMessage(request);

            if (response.isOk()) {
                log.info("Slack block message sent: channel={}, ts={}", response.getChannel(), response.getTs());
            } else {
                log.warn("Slack block message failed: {}", response.getError());
            }
        } catch (final SlackApiException e) {
            log.error("Slack API exception while sending blocks: {}", e.getError(), e);
        } catch (final IOException e) {
            log.error("I/O error while sending Slack blocks", e);
        }
    }
}
