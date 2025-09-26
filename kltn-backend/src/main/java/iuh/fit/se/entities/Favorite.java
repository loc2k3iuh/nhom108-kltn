package iuh.fit.se.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "favorites")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Favorite {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  User user;

  @ManyToOne
  @JoinColumn(name = "product_id", nullable = false)
  Product product;

  @Column(name = "created_date")
  @CreationTimestamp
  LocalDateTime createdDate;
}
