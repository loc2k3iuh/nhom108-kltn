package iuh.fit.se.entities;

import iuh.fit.se.enums.PaymentMethod;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "payments")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Payment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @OneToOne
  @JoinColumn(name = "order_id", nullable = false)
  Order order;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  PaymentMethod method;

  @Column(nullable = false, precision = 15, scale = 2)
  BigDecimal amount;

  @Column(name = "transaction_id")
  String transactionId;

  @Column(name = "paid_at")
  LocalDateTime paidAt;
}
