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
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "reviews")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Review {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @Column(name = "rating")
  Long rating;

  @Column(name = "comment")
  String comment;

  @ManyToOne
  @JoinColumn(name = "product_id")
  Product product;

  @ManyToOne
  @JoinColumn(name = "user_id")
  User user;

  @Column(name = "created_date")
  @CreationTimestamp
  LocalDateTime createdDate;

  @Column(name = "updated_date")
  @UpdateTimestamp
  LocalDateTime updatedDate;
}
