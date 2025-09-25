package iuh.fit.se.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "carts")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Cart {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @Column(name = "created_date")
  @CreationTimestamp
  LocalDateTime createdDate;

  @Column(name = "updated_date")
  @UpdateTimestamp
  LocalDateTime updatedDate;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  User user;
}
