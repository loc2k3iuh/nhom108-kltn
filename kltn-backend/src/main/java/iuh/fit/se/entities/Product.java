package iuh.fit.se.entities;

import iuh.fit.se.enums.ProductStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "products")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Product {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  String name;

  @Column(columnDefinition = "TEXT")
  String description;

  @Column(name = "base_price")
  Double basePrice;

  @Enumerated(EnumType.STRING)
  ProductStatus status;

  @ManyToOne
  @JoinColumn(name = "category_id")
  Category category;

  @ManyToOne
  @JoinColumn(name = "brand_id")
  Brand brand;
}
