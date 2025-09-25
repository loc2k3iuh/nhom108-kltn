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
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "product_variants")
public class ProductVariant {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  String sku;

  Double price;

  @Column(name = "stock_quantity")
  Integer stockQuantity;

  String material;

  @Column(name = "image_url")
  String imageUrl;

  @ManyToOne
  @JoinColumn(name = "product_id")
  Product product;

  @ManyToOne
  @JoinColumn(name = "size_id")
  Size size;

  @ManyToOne
  @JoinColumn(name = "color_id")
  Color color;
}
