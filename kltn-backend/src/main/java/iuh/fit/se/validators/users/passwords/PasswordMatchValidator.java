package iuh.fit.se.validators.users.passwords;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.lang.reflect.Field;

public class PasswordMatchValidator implements ConstraintValidator<PasswordMatch, Object> {

  private String fieldName;
  private String fieldMatchName;

  @Override
  public void initialize(PasswordMatch constraintAnnotation) {
    this.fieldName = constraintAnnotation.field();
    this.fieldMatchName = constraintAnnotation.fieldMatch();
  }

  @Override
  public boolean isValid(Object value, ConstraintValidatorContext context) {
    try {
      Object fieldValue = getFieldValue(value, fieldName);
      Object fieldMatchValue = getFieldValue(value, fieldMatchName);

      if (fieldValue == null || fieldMatchValue == null) {
        return false;
      }

      return fieldValue.equals(fieldMatchValue);
    } catch (Exception e) {
      return false;
    }
  }

  private Object getFieldValue(Object object, String fieldName)
      throws NoSuchFieldException, IllegalAccessException {
    Field field = object.getClass().getDeclaredField(fieldName);
    field.setAccessible(true);
    return field.get(object);
  }
}
