package iuh.fit.se.validators.passwords;

import iuh.fit.se.dtos.requests.RegisterUserRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordMatchValidator
    implements ConstraintValidator<PasswordMatch, RegisterUserRequest> {

  @Override
  public boolean isValid(
      RegisterUserRequest registerUserRequest,
      ConstraintValidatorContext constraintValidatorContext) {
    if (registerUserRequest.getPassword() == null
        || registerUserRequest.getRetypePassword() == null) {
      return false;
    }
    return registerUserRequest.getPassword().equals(registerUserRequest.getRetypePassword());
  }
}
