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
@Table(name = "addresses")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Address {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  String street;
  String city;
  String zip;
  String ward;
  String district;

  @Column(name = "detail_address")
  String detailAddress;

  @Column(name = "phone_number", unique = true)
  String phoneNumber;

  @ManyToOne
  @JoinColumn(name = "user_id")
  User user;
}
