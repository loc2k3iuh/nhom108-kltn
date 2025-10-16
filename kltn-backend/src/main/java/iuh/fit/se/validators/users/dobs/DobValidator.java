package iuh.fit.se.validators.users.dobs;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class DobValidator implements ConstraintValidator<DobConstraint, LocalDate> {

  int min;

  @Override
  public void initialize(DobConstraint constraintAnnotation) {
    ConstraintValidator.super.initialize(constraintAnnotation);
    min = constraintAnnotation.min();
  }

  @Override
  public boolean isValid(LocalDate localDate, ConstraintValidatorContext context) {
    if (localDate == null) {
      return true; // Not validate if the field is null
    }
    long years = ChronoUnit.YEARS.between(localDate, LocalDate.now());

    return years >= min;
  }
}
