package iuh.fit.se.exceptions;

import iuh.fit.se.api_responses.APIResponse;
import jakarta.validation.ConstraintViolation;
import java.util.Map;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

  private static final String MIN_ATTRIBUTE = "min";

  @ExceptionHandler(value = MethodArgumentNotValidException.class)
  ResponseEntity<APIResponse> handleMethodArgumentNotValidException(
      MethodArgumentNotValidException e) {
    String keyenum = e.getBindingResult().getFieldError().getDefaultMessage();
    ErrorCode errorCode = ErrorCode.valueOf(keyenum);
    var constraintViolations =
        e.getBindingResult().getAllErrors().get(0).unwrap(ConstraintViolation.class);
    Map<String, Object> attributes = constraintViolations.getConstraintDescriptor().getAttributes();
    log.info(attributes.toString());
    APIResponse apiResponse = new APIResponse();
    apiResponse.setCode(errorCode.getCode());
    apiResponse.setMessage(
        Objects.nonNull(attributes)
            ? mapAttributeToMessage(errorCode.getMessage(), attributes)
            : errorCode.getMessage());
    return ResponseEntity.status(errorCode.getHttpStatusCode()).body(apiResponse);
  }

  private String mapAttributeToMessage(String message, Map<String, Object> attributes) {
    String minValue = String.valueOf(attributes.get(MIN_ATTRIBUTE));
    return message.replace("{" + MIN_ATTRIBUTE + "}", minValue);
  }

  @ExceptionHandler(value = AppException.class)
  ResponseEntity<APIResponse> handleAppException(AppException appException) {
    ErrorCode errorCode = appException.getErrorCode();
    APIResponse apiResponse = new APIResponse();
    apiResponse.setCode(errorCode.getCode());
    apiResponse.setMessage(errorCode.getMessage());
    return ResponseEntity.status(errorCode.getHttpStatusCode()).body(apiResponse);
  }
}
