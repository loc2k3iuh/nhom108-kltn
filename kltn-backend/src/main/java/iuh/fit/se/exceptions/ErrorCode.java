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
    PERMISSION_NOT_FOUND(1012, "Permission doesn't exist !", HttpStatus.BAD_REQUEST)
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
