package iuh.fit.se.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "cart_items")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  Long quantity;

  @ManyToOne
  @JoinColumn(name = "cart_id")
  Cart cart;

  @ManyToOne
  @JoinColumn(name = "product_id")
  Product product;
}
