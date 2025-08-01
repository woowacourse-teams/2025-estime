package com.estime.connection.slack.presentation;

import com.estime.connection.slack.application.service.SlackService;
import com.estime.connection.slack.presentation.dto.SlackSlashCommandRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/slack")
@RequiredArgsConstructor
public class SlackController {

    private final SlackService slackService;

    @PostMapping("/command")
    public ResponseEntity<Void> handleSlashCommand(@ModelAttribute final SlackSlashCommandRequest request) {
        slackService.handleSlashCommand(request.toInput());
        return ResponseEntity.ok().build();
    }
}
