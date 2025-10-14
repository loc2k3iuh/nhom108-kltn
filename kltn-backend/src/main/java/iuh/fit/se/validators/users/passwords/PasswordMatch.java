package iuh.fit.se.validators.users.passwords;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PasswordMatchValidator.class)
public @interface PasswordMatch {
  String message() default "Password do not match";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};

  String field();

  String fieldMatch();
}
