package iuh.fit.se.entities;

import iuh.fit.se.enums.RoleType;
import jakarta.persistence.*;
import java.util.Set;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "roles")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Role {
  @Id
  @Enumerated(EnumType.STRING)
  RoleType name;

  String description;

  @ManyToMany Set<Permission> permissions;

  public Role(RoleType name) {
    this.name = name;
  }
}
