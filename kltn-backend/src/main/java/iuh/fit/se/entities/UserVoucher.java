package iuh.fit.se.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "user_vouchers")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserVoucher {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "voucher_id")
  Voucher voucher;

  @Column(name = "usage_count", nullable = false)
  Integer usageCount = 0;

  @Column(name = "acquired_at")
  LocalDateTime acquiredAt = LocalDateTime.now();
}
