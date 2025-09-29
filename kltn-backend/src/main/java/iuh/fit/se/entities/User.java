package iuh.fit.se.entities;

import iuh.fit.se.enums.UserStatus;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @Column(
      name = "username",
      unique = true,
      columnDefinition = "varchar(255) COLLATE utf8mb4_general_ci")
  String username;

  @Column(
      name = "email",
      unique = true,
      columnDefinition = "varchar(255) COLLATE utf8mb4_general_ci",
      nullable = false)
  String email;

  @Column(name = "phone_number", unique = true)
  String phoneNumber;

  @Column(name = "password")
  String password;

  @Column(name = "full_name")
  String fullName;

  @Column(name = "address")
  String address;

  @Column(name = "date_of_birth")
  LocalDate dateOfBirth;

  @Column(name = "is_active")
  Boolean isActive;

  @Column(name = "enabled")
  Boolean enabled = false;

  @Column(name = "avatar_url", length = 300)
  String avatarUrl;

  @Column(name = "created_date")
  @CreationTimestamp
  Date createdDate;

  @Column(name = "updated_date")
  @UpdateTimestamp
  Date updatedDate;

  @Enumerated(EnumType.STRING)
  UserStatus status;

  @Column(name = "last_login")
  Date lastLogin = new Date();

  @ManyToMany(fetch = FetchType.EAGER)
  @ToString.Exclude
  Set<Role> roles;

  @OneToMany(
      mappedBy = "user",
      cascade = CascadeType.ALL,
      fetch = FetchType.LAZY,
      orphanRemoval = true)
  @ToString.Exclude
  List<UserVoucher> userVouchers = new ArrayList<>();

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @ToString.Exclude
  List<Address> addresses = new ArrayList<>();
}
