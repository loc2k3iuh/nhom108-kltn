package iuh.fit.se.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "message_rooms")
public class MessageRoom {

  @Id
  @GeneratedValue(generator = "UUID", strategy = GenerationType.AUTO)
  UUID id;

  String name;

  String imageURL;

  @CreationTimestamp
  @Column(name = "created_date")
  LocalDateTime createDate;

  @ManyToOne
  @JoinColumn(name = "created_by")
  User user;

  @OneToMany(mappedBy = "messageRoom", cascade = CascadeType.ALL)
  List<MessageRoomMember> messageRoomMembers;

  @OneToMany(mappedBy = "messageRoom", cascade = CascadeType.ALL)
  List<MessageContent> messageContents;
}
