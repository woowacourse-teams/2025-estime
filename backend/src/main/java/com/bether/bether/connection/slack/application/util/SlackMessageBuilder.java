package com.bether.bether.connection.slack.application.util;

import com.bether.bether.connection.application.dto.input.ConnectedRoomCreateMessageInput;
import com.slack.api.model.block.ActionsBlock;
import com.slack.api.model.block.HeaderBlock;
import com.slack.api.model.block.LayoutBlock;
import com.slack.api.model.block.composition.PlainTextObject;
import com.slack.api.model.block.element.ButtonElement;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class SlackMessageBuilder {

    public List<LayoutBlock> buildConnectedRoomCreateBlocks(final ConnectedRoomCreateMessageInput input) {
        return List.of(
                HeaderBlock.builder()
                        .text(plain("💡 아인슈타임이 나타났어요!"))
                        .build(),
                ActionsBlock.builder()
                        .elements(List.of(
                                ButtonElement.builder()
                                        .text(plain("🔗 일정 조율 시작하기"))
                                        .url(input.connectedRoomCreateUrl())
                                        .actionId("create-connected-room")
                                        .build()
                        ))
                        .build()
        );
    }

    private PlainTextObject plain(final String text) {
        return PlainTextObject.builder().text(text).emoji(true).build();
    }
}
