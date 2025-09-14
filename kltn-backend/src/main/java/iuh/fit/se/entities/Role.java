package iuh.fit.se.entities;

import iuh.fit.se.enums.RoleType;
import jakarta.persistence.*;
import java.util.Set;
import lombok.*;

@ToString
@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "roles")
public class Role {
  @Id
  @Enumerated(EnumType.STRING)
  private RoleType name;

  private String description;

  @ManyToMany Set<Permission> permissions;
}
