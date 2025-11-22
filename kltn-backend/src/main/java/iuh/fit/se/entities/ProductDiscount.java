package iuh.fit.se.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "product_discounts")
@FieldDefaults(level = AccessLevel.PRIVATE)
@IdClass(ProductDiscountId.class)
public class ProductDiscount {

  @Id
  @ManyToOne
  @JoinColumn(name = "product_id")
  Product product;

  @Id
  @ManyToOne
  @JoinColumn(name = "discount_id")
  Discount discount;
}
