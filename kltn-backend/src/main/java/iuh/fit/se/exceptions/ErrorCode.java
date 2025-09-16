package iuh.fit.se.exceptions;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCode {
  NAME_REQUIRED(1002, "Name cannot be empty!", HttpStatus.BAD_REQUEST),
  USERNAME_REQUIRED(1003, "Username cannot be empty !", HttpStatus.BAD_REQUEST),
  USERNAME_INVALID(1004, "Username must be at least {min} characters !", HttpStatus.BAD_REQUEST),
  EMAIL_REQUIRED(1005, "Email cannot be empty !", HttpStatus.BAD_REQUEST),
  EMAIL_INVALID(1006, "Email must be in the format example@gmail.com !", HttpStatus.BAD_REQUEST),
  FULLNAME_REQUIRED(1007, "Full name cannot be empty !", HttpStatus.BAD_REQUEST),
  FULLNAME_INVALID(1008, "Full name must be at least {min} characters !", HttpStatus.BAD_REQUEST),
  PASSWORD_REQUIRED(1009, "Password cannot empty !", HttpStatus.BAD_REQUEST),
  PASSWORD_INVALID(1010, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
  RETYPE_PASSWORD_REQUIRED(1011, "Retype password cannot be empty", HttpStatus.BAD_REQUEST),
  PERMISSION_ALREADY_EXIST(1012, "Permission already exists !", HttpStatus.BAD_REQUEST),
  PERMISSION_NOT_FOUND(1013, "Permission doesn't exist !", HttpStatus.NOT_FOUND),
  PERMISSIONS_REQUIRED(1014, "Permissions cannot be empty !", HttpStatus.BAD_REQUEST),
  ROLE_NOT_FOUND(1014, "Role doesn't exist !", HttpStatus.NOT_FOUND),
  ROLE_ALREADY_EXIST(1015, "Role already exists !", HttpStatus.BAD_REQUEST),
  EMAIL_ALREADY_EXISTS(1016, "Password already exists !", HttpStatus.BAD_REQUEST),
  USERNAME_ALREADY_EXISTS(1017, "Username already exist !", HttpStatus.BAD_REQUEST),
  TOKEN_REQUIRED(1018, "Token cannot be empty !", HttpStatus.BAD_REQUEST),
  TOKEN_NOT_FOUND(1019, "Token doesn't exists !", HttpStatus.NOT_FOUND),
  TOKEN_CONFIRMED(1020, "Token has already been confirmed !", HttpStatus.BAD_REQUEST),
  TOKEN_EXPIRED(1021, "Token has already been expired !", HttpStatus.BAD_REQUEST),
  USER_NOT_FOUND(1022, "User doesn't exist !", HttpStatus.NOT_FOUND),
  UNAUTHENTICATED(1023, "Unauthenticated !!!", HttpStatus.UNAUTHORIZED),
  USER_DISABLED(1024, "User disabled !", HttpStatus.FORBIDDEN),
  USER_INACTIVATED(1025, "User inactivated !", HttpStatus.FORBIDDEN),
  ACCESS_DENIED(1026, "You don't have permission !", HttpStatus.FORBIDDEN),
  FILE_TOO_LARGE(1027, "Your file is too large !", HttpStatus.BAD_REQUEST),
  TOKEN_INVALID(1028, "Token invalid !", HttpStatus.UNAUTHORIZED)

  ;

  int code;
  String message;
  HttpStatusCode httpStatusCode;

  ErrorCode(int code, String message, HttpStatusCode httpStatusCode) {
    this.code = code;
    this.message = message;
    this.httpStatusCode = httpStatusCode;
  }
}
