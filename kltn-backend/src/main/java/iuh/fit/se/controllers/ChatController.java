package iuh.fit.se.controllers;

import iuh.fit.se.dtos.requests.ChatRequest;
import iuh.fit.se.dtos.responses.ChatResponse;
import iuh.fit.se.services.interfaces.IChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private final IChatService chatService;

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest chatRequest) {
        return chatService.processMessage(chatRequest.message());
    }
}
