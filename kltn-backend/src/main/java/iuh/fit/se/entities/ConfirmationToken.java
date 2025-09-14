package iuh.fit.se.entities;

import jakarta.persistence.*;
import java.util.Date;
import lombok.*;

@Entity
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "confirmation_tokens")
public class ConfirmationToken {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String token;

  @ManyToOne
  @JoinColumn(nullable = false, name = "user_id")
  private User user;

  private Date createdAt;
  private Date expiresAt;
  private Date confirmedAt;
}
