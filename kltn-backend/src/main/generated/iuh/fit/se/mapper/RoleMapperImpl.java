package iuh.fit.se.mapper;

import iuh.fit.se.dtos.requests.RoleRequest;
import iuh.fit.se.dtos.responses.PermissionResponse;
import iuh.fit.se.dtos.responses.RoleResponse;
import iuh.fit.se.entities.Permission;
import iuh.fit.se.entities.Role;
import iuh.fit.se.repositories.PermissionRepository;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-18T07:28:15+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 24.0.2 (Oracle Corporation)"
)
@Component
public class RoleMapperImpl implements RoleMapper {

    @Override
    public Role toRoleEntity(RoleRequest dto, PermissionRepository permissionRepository) {
        if ( dto == null ) {
            return null;
        }

        Role.RoleBuilder role = Role.builder();

        role.permissions( mapPermissions( dto.getPermissions(), permissionRepository ) );
        role.name( map( dto.getName() ) );
        role.description( dto.getDescription() );

        return role.build();
    }

    @Override
    public RoleResponse toRoleResponse(Role role) {
        if ( role == null ) {
            return null;
        }

        RoleResponse roleResponse = new RoleResponse();

        if ( role.getName() != null ) {
            roleResponse.setName( role.getName().name() );
        }
        roleResponse.setDescription( role.getDescription() );
        roleResponse.setPermissions( permissionSetToPermissionResponseSet( role.getPermissions() ) );

        return roleResponse;
    }

    @Override
    public List<RoleResponse> toListRoleResponse(List<Role> roles) {
        if ( roles == null ) {
            return null;
        }

        List<RoleResponse> list = new ArrayList<RoleResponse>( roles.size() );
        for ( Role role : roles ) {
            list.add( toRoleResponse( role ) );
        }

        return list;
    }

    protected PermissionResponse permissionToPermissionResponse(Permission permission) {
        if ( permission == null ) {
            return null;
        }

        PermissionResponse permissionResponse = new PermissionResponse();

        permissionResponse.setName( permission.getName() );
        permissionResponse.setDescription( permission.getDescription() );

        return permissionResponse;
    }

    protected Set<PermissionResponse> permissionSetToPermissionResponseSet(Set<Permission> set) {
        if ( set == null ) {
            return null;
        }

        Set<PermissionResponse> set1 = LinkedHashSet.newLinkedHashSet( set.size() );
        for ( Permission permission : set ) {
            set1.add( permissionToPermissionResponse( permission ) );
        }

        return set1;
    }
}
