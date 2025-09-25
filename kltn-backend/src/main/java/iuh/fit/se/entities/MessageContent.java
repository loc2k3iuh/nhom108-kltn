package iuh.fit.se.entities;

import iuh.fit.se.enums.MessageType;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@Setter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "message_contents")
@FieldDefaults(level = AccessLevel.PRIVATE)
@EntityListeners(AuditingEntityListener.class)
public class MessageContent {

  @Id
  @GeneratedValue(generator = "UUID", strategy = GenerationType.AUTO)
  UUID id;

  String content;

  @Column(name = "data_sent")
  LocalDateTime dataSent;

  @Enumerated(EnumType.STRING)
  MessageType messageType;

  @ManyToOne
  @JoinColumn(name = "message_room_id")
  MessageRoom messageRoom;

  @ManyToOne
  @JoinColumn(name = "username")
  User user;
}
