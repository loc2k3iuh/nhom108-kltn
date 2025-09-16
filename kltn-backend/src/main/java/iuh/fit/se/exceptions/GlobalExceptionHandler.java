package iuh.fit.se.exceptions;

import iuh.fit.se.api_responses.APIResponse;

import java.util.Map;
import java.util.Objects;

import jakarta.validation.ConstraintViolation;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

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

  @ExceptionHandler(value = AccessDeniedException.class)
  ResponseEntity<APIResponse> handleAccessDeniedException(AccessDeniedException e) {
    APIResponse apiResponse = new APIResponse();
    apiResponse.setCode(ErrorCode.ACCESS_DENIED.getCode());
    apiResponse.setMessage(ErrorCode.ACCESS_DENIED.getMessage());
    return ResponseEntity.status(ErrorCode.ACCESS_DENIED.getHttpStatusCode())
            .body(apiResponse);
  }

  @ExceptionHandler(value = MaxUploadSizeExceededException.class)
  ResponseEntity<APIResponse> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException e) {
    // Lỗi này do file vượt quá kích thước tối đa cho phép
    ErrorCode errorCode = ErrorCode.FILE_TOO_LARGE; // Đặt mã lỗi tương ứng

    APIResponse apiResponse = new APIResponse();
    apiResponse.setCode(errorCode.getCode());
    apiResponse.setMessage(errorCode.getMessage());

    return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
            .body(apiResponse); // Trả về mã HTTP 413 (Payload Too Large)
  }
}
