package iuh.fit.se.entities;

import iuh.fit.se.enums.DiscountType;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "vouchers")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Voucher {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @Column(unique = true, nullable = false, length = 50)
  String code;

  String description;

  @Enumerated(EnumType.STRING)
  @Column(name = "discount_type")
  DiscountType discountType;

  @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
  BigDecimal discountValue;

  @Column(name = "min_value_order")
  BigDecimal minValueOrder;

  @Column(name = "max_discount_value")
  BigDecimal maxDiscountValue;

  @Column(name = "usage_limit")
  Integer usageLimit;

  @Column(name = "usage_per_user")
  Integer usagePerUser;

  @Column(name = "start_date")
  LocalDateTime startDate;

  @Column(name = "end_date")
  LocalDateTime endDate;

  Boolean active = true;

  @OneToMany(mappedBy = "voucher", cascade = CascadeType.ALL, orphanRemoval = true)
  List<UserVoucher> userVouchers = new ArrayList<>();
}
