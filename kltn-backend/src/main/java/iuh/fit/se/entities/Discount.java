package iuh.fit.se.entities;

import iuh.fit.se.enums.DiscountType;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "discounts")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Discount {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  String name;

  @Enumerated(EnumType.STRING)
  @Column(name = "discount_type")
  DiscountType discountType;

  Double value;

  @Column(name = "start_date")
  LocalDateTime startDate;

  @Column(name = "end_date")
  LocalDateTime endDate;
}
