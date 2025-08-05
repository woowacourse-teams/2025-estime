package com.estime.connection.application.slack.util;

import com.estime.connection.application.dto.input.ConnectedRoomCreateMessageInput;
import com.estime.connection.application.dto.input.ConnectedRoomCreatedMessageInput;
import com.estime.connection.domain.PlatformMessage;
import com.estime.connection.domain.PlatformMessageStyle;
import com.slack.api.model.block.ActionsBlock;
import com.slack.api.model.block.HeaderBlock;
import com.slack.api.model.block.LayoutBlock;
import com.slack.api.model.block.SectionBlock;
import com.slack.api.model.block.composition.MarkdownTextObject;
import com.slack.api.model.block.composition.PlainTextObject;
import com.slack.api.model.block.element.ButtonElement;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class SlackMessageBuilder {

    public List<LayoutBlock> buildConnectedRoomCreateBlocks(final ConnectedRoomCreateMessageInput input) {
        final PlatformMessage platformMessage = PlatformMessage.CONNECTED_ROOM_CREATE;

        return List.of(
                HeaderBlock.builder()
                        .text(plainText(platformMessage.getTitle()))
                        .build(),
                ActionsBlock.builder()
                        .elements(List.of(
                                ButtonElement.builder()
                                        .text(plainText(platformMessage.getShortcutDescription()))
                                        .url(input.shortcut())
                                        .actionId("create-connected-room")
                                        .build()
                        ))
                        .build()
        );
    }

    public List<LayoutBlock> buildConnectedRoomCreatedBlocks(final ConnectedRoomCreatedMessageInput input) {
        final PlatformMessage platformMessage = PlatformMessage.CONNECTED_ROOM_CREATED;
        final String formattedDeadline = input.deadline().getStartAt()
                .format(PlatformMessageStyle.DEFAULT.getDateTimeFormatter());

        return List.of(
                HeaderBlock.builder()
                        .text(plainText(platformMessage.getTitle()))
                        .build(),
                SectionBlock.builder()
                        .text(markdown("> *제목:* " + input.title() + "\n> *마감기한:* " + formattedDeadline))
                        .build(),
                ActionsBlock.builder()
                        .elements(List.of(
                                ButtonElement.builder()
                                        .text(plainText(platformMessage.getShortcutDescription()))
                                        .url(input.shortcut())
                                        .actionId("view-created-room")
                                        .build()
                        ))
                        .build()
        );
    }

    private MarkdownTextObject markdown(final String text) {
        return MarkdownTextObject.builder()
                .text(text)
                .build();
    }

    private PlainTextObject plainText(final String text) {
        return PlainTextObject.builder()
                .text(text)
                .emoji(true)
                .build();
    }
}
