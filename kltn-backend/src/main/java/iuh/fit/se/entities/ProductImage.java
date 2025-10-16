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
@Table(name = "product_images")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductImage {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @Column(name = "image_url")
  String imageUrl;

  Boolean isMain;

  @Column(name = "is_primary")
  Boolean isPrimary;

  @Column(name = "sort_order")
  Integer sortOrder;

  @Column(name = "display_order")
  Integer displayOrder;

  @ManyToOne
  @JoinColumn(name = "product_id")
  Product product;
}
