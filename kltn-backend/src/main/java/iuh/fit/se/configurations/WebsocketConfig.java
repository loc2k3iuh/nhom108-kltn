package iuh.fit.se.configurations;

import iuh.fit.se.components.CustomHandshakeHandler;
import iuh.fit.se.components.WebSocketAuthInterceptor;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@RequiredArgsConstructor
@EnableWebSocketMessageBroker
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WebsocketConfig implements WebSocketMessageBrokerConfigurer {

  @NonFinal
  @Value("${vite.frontend.urls}")
  String[] ALLOWED_ORIGINS;

  CustomHandshakeHandler customHandshakeHandler;
  WebSocketAuthInterceptor webSocketAuthInterceptor;

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/ws")
            .addInterceptors(webSocketAuthInterceptor)
            .setHandshakeHandler(customHandshakeHandler)
            .setAllowedOriginPatterns(ALLOWED_ORIGINS).withSockJS();
  }

  @Override
  public void configureMessageBroker(MessageBrokerRegistry registry) {
    registry.enableSimpleBroker("/topic");
    registry.setApplicationDestinationPrefixes("/app");
    registry.setUserDestinationPrefix("/user");
  }
}
