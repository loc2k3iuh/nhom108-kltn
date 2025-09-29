package iuh.fit.se.validators.users.fullnames;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = FullNameValidator.class)
public @interface FullNameConstraint {

  String message() default "Invalid full name !";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}
