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
  FULLNAME_INVALID(
      1008,
      "Full name must be at least {min} characters and not contain special characters !",
      HttpStatus.BAD_REQUEST),
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
  TOKEN_INVALID(1028, "Token invalid !", HttpStatus.UNAUTHORIZED),
  USER_ALREADY_CONFIRMED(1029, "User already confirmed !", HttpStatus.UNAUTHORIZED),
  UNAUTHORIZED(1030, "Unauthorized !", HttpStatus.UNAUTHORIZED),
  UPLOAD_ERROR(1031, "Error in uploading image of user", HttpStatus.BAD_REQUEST),
  OTP_NOT_FOUND(1032, "Otp code not found", HttpStatus.BAD_REQUEST),
  OTP_REQUIRED(1033, "Otp cannot be empty !", HttpStatus.BAD_REQUEST),
  OTP_INVALID(1034, "Otp must be 6 integers!", HttpStatus.BAD_REQUEST),
  MAX_OTP(
      1035,
      "You have sent OTP more than 3 times in 10 minutes. Please try again later !",
      HttpStatus.BAD_REQUEST),
  REFRESH_TOKEN_NOT_FOUND(1036, "Refresh token not found !", HttpStatus.BAD_REQUEST),
  REFRESH_TOKEN_REQUIRED(1037, "Refresh token cannot be empty !", HttpStatus.BAD_REQUEST),
  REFRESH_TOKEN_INVALID(1038, "Refresh already expired !", HttpStatus.BAD_REQUEST),
  PASSWORD_MUST_MATCH(1039, "Password must match !", HttpStatus.BAD_REQUEST),
  INVALID_INPUT(1040, "Error Enum doesn't match !", HttpStatus.BAD_REQUEST),
  TOKEN_NOT_EXPIRED(1041, "Reset token doesn't expire yet, try again !", HttpStatus.BAD_REQUEST),

  // Color related errors
  COLOR_NOT_FOUND(1042, "Color not found!", HttpStatus.NOT_FOUND),
  COLOR_ALREADY_EXISTS(1043, "Color already exists!", HttpStatus.BAD_REQUEST),

  // Size related errors
  SIZE_NOT_FOUND(1044, "Size not found!", HttpStatus.NOT_FOUND),
  SIZE_ALREADY_EXISTS(1045, "Size already exists!", HttpStatus.BAD_REQUEST),

  // Brand related errors
  BRAND_NOT_FOUND(1046, "Brand not found!", HttpStatus.NOT_FOUND),
  BRAND_ALREADY_EXISTS(1047, "Brand already exists!", HttpStatus.BAD_REQUEST),

  // Category related errors
  CATEGORY_NOT_FOUND(1048, "Category not found!", HttpStatus.NOT_FOUND),
  CATEGORY_ALREADY_EXISTS(1049, "Category already exists!", HttpStatus.BAD_REQUEST),
  CATEGORY_HAS_SUBCATEGORIES(
      1050, "Cannot delete category that has subcategories!", HttpStatus.BAD_REQUEST),
  INVALID_PARENT_CATEGORY(1051, "Invalid parent category!", HttpStatus.BAD_REQUEST),

  // Product related errors
  PRODUCT_NOT_FOUND(1052, "Product not found!", HttpStatus.NOT_FOUND),
  PRODUCT_ALREADY_EXISTS(1053, "Product already exists!", HttpStatus.BAD_REQUEST),
  PRODUCT_OUT_OF_STOCK(1054, "Product is out of stock!", HttpStatus.BAD_REQUEST),

  // Product Variant related errors
  PRODUCT_VARIANT_NOT_FOUND(1055, "Product variant not found!", HttpStatus.NOT_FOUND),
  PRODUCT_VARIANT_ALREADY_EXISTS(1056, "Product variant already exists!", HttpStatus.BAD_REQUEST),
  PRODUCT_VARIANT_OUT_OF_STOCK(1057, "Product variant is out of stock!", HttpStatus.BAD_REQUEST),

  // Cart related errors
  CART_NOT_FOUND(1058, "Cart not found!", HttpStatus.NOT_FOUND),
  CART_ITEM_NOT_FOUND(1059, "Cart item not found!", HttpStatus.NOT_FOUND),
  INVALID_QUANTITY(1060, "Invalid quantity!", HttpStatus.BAD_REQUEST),

  // Review related errors
  REVIEW_NOT_FOUND(1061, "Review not found!", HttpStatus.NOT_FOUND),
  REVIEW_ALREADY_EXISTS(1062, "You have already reviewed this product!", HttpStatus.BAD_REQUEST),

  // Discount related errors
  DISCOUNT_NOT_FOUND(1063, "Discount not found!", HttpStatus.NOT_FOUND),
  DISCOUNT_ALREADY_EXISTS(1064, "Discount already exists!", HttpStatus.BAD_REQUEST),
  DISCOUNT_INVALID_VALUE(1065, "Invalid discount value!", HttpStatus.BAD_REQUEST),
  DISCOUNT_INVALID_DATE_RANGE(1066, "Invalid discount date range!", HttpStatus.BAD_REQUEST),
  DISCOUNT_IN_USE(
      1067, "Discount is currently in use and cannot be deleted!", HttpStatus.BAD_REQUEST),
  DISCOUNT_NOT_ACTIVE(1068, "Discount is not active!", HttpStatus.BAD_REQUEST),
  DISCOUNT_EXPIRED(1069, "Discount has expired!", HttpStatus.BAD_REQUEST),
  PRODUCT_DISCOUNT_ALREADY_EXISTS(
      1070, "Product already has this discount!", HttpStatus.BAD_REQUEST),
  PRODUCT_DISCOUNT_NOT_FOUND(1071, "Product discount not found!", HttpStatus.NOT_FOUND),
  DISCOUNT_USAGE_LIMIT_EXCEEDED(1072, "Discount usage limit exceeded!", HttpStatus.BAD_REQUEST),

  // Favorite related errors
  FAVORITE_NOT_FOUND(1073, "Favorite not found!", HttpStatus.NOT_FOUND),
  PRODUCT_ALREADY_IN_FAVORITES(1074, "Product is already in favorites!", HttpStatus.BAD_REQUEST),

  // User related errors
  USER_NOT_EXISTED(1075, "User does not exist!", HttpStatus.NOT_FOUND),

  INVALID_PRICE_RANGE(
      1083, "Invalid price range! Min price must be less than max price!", HttpStatus.BAD_REQUEST),
  INVALID_DISCOUNT_RANGE(
      1084,
      "Invalid discount range! Min discount must be less than max discount!",
      HttpStatus.BAD_REQUEST),
  FILTER_CRITERIA_INVALID(1085, "Invalid filter criteria!", HttpStatus.BAD_REQUEST),
  PRODUCT_INACTIVE(1086, "Product is inactive!", HttpStatus.BAD_REQUEST);

  int code;
  String message;
  HttpStatusCode httpStatusCode;

  ErrorCode(int code, String message, HttpStatusCode httpStatusCode) {
    this.code = code;
    this.message = message;
    this.httpStatusCode = httpStatusCode;
  }
}
