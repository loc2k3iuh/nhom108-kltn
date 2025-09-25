package iuh.fit.se.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "order_details")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderDetail {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @ManyToOne
  @JoinColumn(name = "order_id", nullable = false)
  Order order;

  @ManyToOne
  @JoinColumn(name = "product_id", nullable = false)
  ProductVariant productVariant;

  @Column(nullable = false)
  Integer quantity;

  @Column(nullable = false, precision = 15, scale = 2)
  BigDecimal price;

  @Column(name = "total_price", nullable = false, precision = 15, scale = 2)
  BigDecimal totalPrice;
}
