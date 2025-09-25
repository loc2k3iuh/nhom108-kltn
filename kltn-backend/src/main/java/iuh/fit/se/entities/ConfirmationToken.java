package iuh.fit.se.entities;

import jakarta.persistence.*;
import java.util.Date;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "confirmation_tokens")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ConfirmationToken {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  String token;

  @ManyToOne
  @JoinColumn(nullable = false, name = "user_id")
  User user;

  Date createdAt;
  Date expiresAt;
  Date confirmedAt;
}
