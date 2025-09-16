package iuh.fit.se.entities;

import iuh.fit.se.enums.UserStatus;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.Date;
import java.util.Set;
import lombok.*;
import lombok.experimental.FieldDefaults;

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
  Date createdDate;

  @Column(name = "updated_date")
  Date updatedDate;

  @Enumerated(EnumType.STRING)
  UserStatus status;

  @Column(name = "last_login")
  Date lastLogin = new Date();

  @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  @ToString.Exclude
  Set<Role> roles;
}
