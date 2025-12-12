package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.responses.ChatResponse;

public interface IChatService {
  ChatResponse processMessage(String message);
}
