package iuh.fit.se.entities;

import iuh.fit.se.enums.ShippingMethod;
import iuh.fit.se.enums.ShippingStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "shippings")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Shipping {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @OneToOne
  @JoinColumn(name = "order_id", nullable = false)
  Order order;

  @Column(name = "receiver_name")
  String receiverName;

  @Column(name = "receiver_phone")
  String receiverPhone;

  String address;
  String city;
  String district;
  String ward;

  @Enumerated(EnumType.STRING)
  ShippingMethod method;

  @Enumerated(EnumType.STRING)
  ShippingStatus status;

  @Column(name = "tracking_code")
  String trackingCode;

  @Column(name = "shipped_at")
  LocalDateTime shippedAt;

  @Column(name = "delivered_At")
  LocalDateTime deliveredAt;
}
