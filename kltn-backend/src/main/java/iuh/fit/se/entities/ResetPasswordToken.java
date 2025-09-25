package iuh.fit.se.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Builder
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "reset_password_tokens")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResetPasswordToken {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @Column(name = "token", nullable = false, unique = true)
  String token;

  @CreationTimestamp
  @Column(name = "created_at")
  LocalDateTime createAt;

  @Column(name = "expiry_date")
  LocalDateTime expiryDate;

  @PrePersist
  public void prePersist() {
    if (expiryDate == null) {
      expiryDate = createAt.plusMinutes(15);
    }
  }

  @ManyToOne
  @JoinColumn(name = "user_id")
  User user;
}
