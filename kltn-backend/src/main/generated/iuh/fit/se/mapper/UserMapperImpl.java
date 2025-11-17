package iuh.fit.se.mapper;

import iuh.fit.se.dtos.requests.RegisterUserRequest;
import iuh.fit.se.dtos.responses.PermissionResponse;
import iuh.fit.se.dtos.responses.PreLoginResponse;
import iuh.fit.se.dtos.responses.RoleResponse;
import iuh.fit.se.dtos.responses.UserResponse;
import iuh.fit.se.entities.Permission;
import iuh.fit.se.entities.Role;
import iuh.fit.se.entities.User;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-17T11:59:04+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 24.0.2 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User toUserEntity(RegisterUserRequest dto) {
        if ( dto == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.username( dto.getUsername() );
        user.email( dto.getEmail() );
        user.password( dto.getPassword() );
        user.fullName( dto.getFullName() );

        return user.build();
    }

    @Override
    public UserResponse toUserResponse(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponse userResponse = new UserResponse();

        userResponse.setId( user.getId() );
        userResponse.setUsername( user.getUsername() );
        userResponse.setEmail( user.getEmail() );
        userResponse.setFullName( user.getFullName() );
        userResponse.setPhoneNumber( user.getPhoneNumber() );
        userResponse.setAddress( user.getAddress() );
        userResponse.setDateOfBirth( user.getDateOfBirth() );
        userResponse.setIsActive( user.getIsActive() );
        userResponse.setAvatarUrl( user.getAvatarUrl() );
        userResponse.setCreatedDate( user.getCreatedDate() );
        userResponse.setUpdatedDate( user.getUpdatedDate() );
        userResponse.setRoles( roleSetToRoleResponseSet( user.getRoles() ) );
        if ( user.getStatus() != null ) {
            userResponse.setStatus( user.getStatus().name() );
        }

        return userResponse;
    }

    @Override
    public PreLoginResponse toPreLoginResponse(User user) {
        if ( user == null ) {
            return null;
        }

        PreLoginResponse.PreLoginResponseBuilder preLoginResponse = PreLoginResponse.builder();

        preLoginResponse.email( user.getEmail() );
        preLoginResponse.roles( roleSetToRoleResponseSet( user.getRoles() ) );

        return preLoginResponse.build();
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

    protected RoleResponse roleToRoleResponse(Role role) {
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

    protected Set<RoleResponse> roleSetToRoleResponseSet(Set<Role> set) {
        if ( set == null ) {
            return null;
        }

        Set<RoleResponse> set1 = LinkedHashSet.newLinkedHashSet( set.size() );
        for ( Role role : set ) {
            set1.add( roleToRoleResponse( role ) );
        }

        return set1;
    }
}
