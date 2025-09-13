package iuh.fit.se.dtos.responses;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.util.Date;
import java.util.Set;

public class UserResponse {

    Long id;
    String username;

    String email;

    @JsonProperty("full_name")
    String fullName;

    @JsonProperty("phone_number")
    String phoneNumber;

    String address;

    @JsonProperty("date_of_birth")
    LocalDate dateOfBirth;

    @JsonProperty("is_active")
    Boolean isActive;

    @JsonProperty("message")
    String message;

    @JsonProperty("avatar_url")
    String avatarUrl;

    @JsonProperty("created_date")
    Date createdDate;

    @JsonProperty("updated_date")
    Date updatedDate;

    @JsonProperty("roles")
    Set<RoleResponse> roles;

    @JsonProperty("status")
    String status;
}
