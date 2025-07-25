package com.bether.bether.connection.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;

import com.bether.bether.connection.application.dto.input.ConnectedRoomCreateInput;
import com.bether.bether.connection.application.dto.output.ConnectedRoomCreateOutput;
import com.bether.bether.connection.discord.infrastructure.DiscordMessageSender;
import com.bether.bether.connection.domain.ConnectedRoom;
import com.bether.bether.connection.domain.ConnectedRoomRepository;
import com.bether.bether.connection.domain.Platform;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class ConnectedRoomApplicationServiceTest {

    @Autowired
    private ConnectedRoomApplicationService connectedRoomApplicationService;

    @Autowired
    private ConnectedRoomRepository connectedRoomRepository;

    @MockitoBean
    private DiscordMessageSender discordMessageSender;

    @DisplayName("플랫폼과 연결된 방 생성을 할 수 있다")
    @Test
    void createConnectedRoom() {
        // given
        final ConnectedRoomCreateInput input = new ConnectedRoomCreateInput(
                "title",
                List.of(LocalDate.now()),
                LocalTime.of(7, 0),
                LocalTime.of(20, 0),
                LocalDateTime.of(2026, 1, 1, 0, 0),
                true,
                Platform.DISCORD,
                "testChannelId"
        );

        doNothing().when(discordMessageSender).sendConnectedRoomCreatedMessage(any(), any());

        // when
        final ConnectedRoomCreateOutput saved = connectedRoomApplicationService.save(input);

        // then
        assertThat(isValidUUID(saved.session().toString()))
                .isTrue();

        final ConnectedRoom connectedRoom = connectedRoomRepository.findBySession(saved.session()).orElseThrow();
        assertThat(connectedRoom.getRoom().getSession()).isEqualTo(saved.session());
    }

    private boolean isValidUUID(final String uuid) {
        if (uuid == null || uuid.isEmpty()) {
            return false;
        }
        try {
            UUID.fromString(uuid);
            return true;
        } catch (final IllegalArgumentException e) {
            return false;
        }
    }
}
