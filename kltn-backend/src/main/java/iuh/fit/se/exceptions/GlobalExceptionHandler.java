package iuh.fit.se.exceptions;

import iuh.fit.se.api_responses.APIResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
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
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GlobalExceptionHandler {

  static String MIN_ATTRIBUTE = "min";

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<APIResponse> handleMethodArgumentNotValidException(
      MethodArgumentNotValidException e, HttpServletRequest request) {

    var error = e.getBindingResult().getAllErrors().get(0);
    String keyEnum = error.getDefaultMessage();

    ErrorCode errorCode;
    try {
      errorCode = ErrorCode.valueOf(keyEnum);
    } catch (IllegalArgumentException ex) {
      errorCode = ErrorCode.INVALID_INPUT;
    }

    ConstraintViolation<?> violation = null;
    try {
      violation = error.unwrap(ConstraintViolation.class);
    } catch (Exception ignored) {
    }

    Map<String, Object> attributes =
        violation != null ? violation.getConstraintDescriptor().getAttributes() : Map.of();

    log.info("Validation attributes: {}", attributes);

    APIResponse apiResponse = new APIResponse();
    apiResponse.setCode(errorCode.getCode());
    apiResponse.setMessage(
        (attributes != null && !attributes.isEmpty())
            ? mapAttributeToMessage(errorCode.getMessage(), attributes)
            : errorCode.getMessage());
    apiResponse.setPath(request.getRequestURI());
    apiResponse.setRequestId(UUID.randomUUID().toString());
    apiResponse.setTimestamp(
        ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"))
            .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));

    log.error("Validation error [{}]: {}", errorCode.name(), apiResponse.getMessage());

    return ResponseEntity.status(errorCode.getHttpStatusCode()).body(apiResponse);
  }

  private String mapAttributeToMessage(String message, Map<String, Object> attributes) {
    String minValue = String.valueOf(attributes.get(MIN_ATTRIBUTE));
    return message.replace("{" + MIN_ATTRIBUTE + "}", minValue);
  }

  @ExceptionHandler(value = AppException.class)
  ResponseEntity<APIResponse> handleAppException(
      AppException appException, HttpServletRequest httpServletRequest) {
    ErrorCode errorCode = appException.getErrorCode();
    APIResponse apiResponse = new APIResponse();
    apiResponse.setCode(errorCode.getCode());
    apiResponse.setMessage(errorCode.getMessage());
    apiResponse.setMessage(appException.getMessage());
    apiResponse.setPath(httpServletRequest.getRequestURI());
    apiResponse.setRequestId(UUID.randomUUID().toString());
    apiResponse.setTimestamp(
        ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"))
            .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));

    log.error(
        "AppException: requestId={}, path={}, code={}, message={}",
        apiResponse.getRequestId(),
        apiResponse.getRequestId(),
        apiResponse.getPath(),
        apiResponse.getMessage());

    return ResponseEntity.status(errorCode.getHttpStatusCode()).body(apiResponse);
  }

  @ExceptionHandler(value = AccessDeniedException.class)
  ResponseEntity<APIResponse> handleAccessDeniedException(
      AccessDeniedException e, HttpServletRequest httpServletRequest) {
    APIResponse apiResponse = new APIResponse();
    apiResponse.setCode(ErrorCode.ACCESS_DENIED.getCode());
    apiResponse.setMessage(ErrorCode.ACCESS_DENIED.getMessage());
    apiResponse.setPath(httpServletRequest.getRequestURI());
    apiResponse.setRequestId(UUID.randomUUID().toString());
    apiResponse.setTimestamp(
        ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"))
            .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));

    log.error(
        "AccessDeniedException: requestId={}, path={}, code={}, message={}",
        apiResponse.getRequestId(),
        apiResponse.getRequestId(),
        apiResponse.getPath(),
        apiResponse.getMessage());
    return ResponseEntity.status(ErrorCode.ACCESS_DENIED.getHttpStatusCode()).body(apiResponse);
  }

  @ExceptionHandler(value = MaxUploadSizeExceededException.class)
  ResponseEntity<APIResponse> handleMaxUploadSizeExceededException(
      MaxUploadSizeExceededException e, HttpServletRequest httpServletRequest) {
    // Lỗi này do file vượt quá kích thước tối đa cho phép
    ErrorCode errorCode = ErrorCode.FILE_TOO_LARGE; // Đặt mã lỗi tương ứng

    APIResponse apiResponse = new APIResponse();
    apiResponse.setCode(errorCode.getCode());
    apiResponse.setMessage(errorCode.getMessage());
    apiResponse.setPath(httpServletRequest.getRequestURI());
    apiResponse.setRequestId(UUID.randomUUID().toString());
    apiResponse.setTimestamp(
        ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"))
            .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));

    log.error(
        "MaxUploadSizeExceededException: requestId={}, path={}, code={}, message={}",
        apiResponse.getRequestId(),
        apiResponse.getRequestId(),
        apiResponse.getPath(),
        apiResponse.getMessage());
    return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
        .body(apiResponse); // Trả về mã HTTP 413 (Payload Too Large)
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<APIResponse> handleUnexpected(Exception e, HttpServletRequest request) {
    APIResponse apiResponse = new APIResponse();
    apiResponse.setCode(9999);
    apiResponse.setMessage("Internal server error");
    apiResponse.setPath(request.getRequestURI());
    apiResponse.setRequestId(UUID.randomUUID().toString());
    apiResponse.setTimestamp(
        ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"))
            .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));

    log.error(
        "Unexpected exception: requestId={}, path={}, error={}",
        apiResponse.getRequestId(),
        apiResponse.getPath(),
        e.getMessage(),
        e);

    return ResponseEntity.internalServerError().body(apiResponse);
  }
}
