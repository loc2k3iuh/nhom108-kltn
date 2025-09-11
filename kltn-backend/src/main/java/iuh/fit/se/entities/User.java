package iuh.fit.se.entities;

import java.time.LocalDate;
import java.util.Date;
import java.util.Set;

import iuh.fit.se.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", unique = true, columnDefinition = "varchar(255) COLLATE utf8mb4_general_ci")
    private String username;

    @Column(
            name = "email",
            unique = true,
            columnDefinition = "varchar(255) COLLATE utf8mb4_general_ci",
            nullable = false)
    private String email;

    @Column(name = "phone_number", unique = true)
    private String phoneNumber;

    @Column(name = "password")
    private String password;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "address")
    private String address;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "enabled")
    private Boolean enabled = false;

    @Column(name = "avatar_url", length = 300)
    private String avatarUrl;

    @Column(name = "created_date")
    private Date createdDate;

    @Column(name = "updated_date")
    private Date updatedDate;

    @Enumerated(EnumType.STRING)
    private UserStatus status;

    @Column(name = "last_login")
    private Date lastLogin = new Date();

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @ToString.Exclude
    Set<Role> roles;
}
