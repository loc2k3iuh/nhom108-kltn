package iuh.fit.se.entities;

import java.io.Serializable;
import java.util.Objects;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductDiscountId implements Serializable {

  Long product;
  Long discount;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    ProductDiscountId that = (ProductDiscountId) o;
    return Objects.equals(product, that.product) && Objects.equals(discount, that.discount);
  }

  @Override
  public int hashCode() {
    return Objects.hash(product, discount);
  }
}
