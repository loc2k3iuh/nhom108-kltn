package iuh.fit.se.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@IdClass(MessageRoomMemberKey.class)
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "message_room_members")
public class MessageRoomMember {

  @Id
  @Column(name = "message_room_id")
  UUID messageRoomId;

  @ManyToOne @JoinColumn MessageRoom messageRoom;

  @Id
  @Column(name = "user_id")
  Long userId;

  @ManyToOne
  @JoinColumn(name = "user_id", insertable = false, updatable = false)
  User user;

  Boolean isAdmin;

  @Column(name = "last_seen")
  LocalDateTime lastSeen;
}
