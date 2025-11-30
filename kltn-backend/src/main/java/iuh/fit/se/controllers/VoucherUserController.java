package iuh.fit.se.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.responses.VoucherResponse;
import iuh.fit.se.services.interfaces.IVoucherService;
import java.math.BigDecimal;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/vouchers/user")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Voucher User", description = "API for user voucher operations")
public class VoucherUserController {

  IVoucherService voucherService;

  @GetMapping("/{userId}")
  @Operation(
      summary = "Get all available vouchers for a user",
      description =
          "Retrieve a paginated list of vouchers available for a specific user with optional keyword search")
  public ResponseEntity<APIResponse<Page<VoucherResponse>>> getAllVouchersForUser(
      @Parameter(description = "User ID", required = true) @PathVariable Long userId,
      @Parameter(description = "Search keyword for voucher code or description")
          @RequestParam(name = "keyword", required = false)
          String keyword,
      @Parameter(description = "Page number (0-indexed)")
          @RequestParam(name = "page", defaultValue = "0")
          int page,
      @Parameter(description = "Number of items per page")
          @RequestParam(name = "size", defaultValue = "10")
          int size) {
    Page<VoucherResponse> vouchers =
        voucherService.getAllVouchersForUser(userId, keyword, page, size);
    return ResponseEntity.ok(
        APIResponse.<Page<VoucherResponse>>builder()
            .code(200)
            .message("Get vouchers for user successfully")
            .result(vouchers)
            .build());
  }

  @GetMapping("/{userId}/suitable")
  @Operation(
      summary = "Get suitable vouchers list for order amount",
      description =
          "Retrieve a list of vouchers (without pagination) that are suitable for a specific order amount (meets minimum order value requirement)")
  public ResponseEntity<APIResponse<List<VoucherResponse>>> getSuitableVouchersForOrder(
      @Parameter(description = "User ID", required = true) @PathVariable Long userId,
      @Parameter(description = "Order amount to filter suitable vouchers", required = true)
          @RequestParam(name = "orderAmount")
          BigDecimal orderAmount) {
    List<VoucherResponse> vouchers =
        voucherService.getSuitableVouchersListForOrderAmount(userId, orderAmount);
    return ResponseEntity.ok(
        APIResponse.<List<VoucherResponse>>builder()
            .code(200)
            .message("Get suitable vouchers for order amount successfully")
            .result(vouchers)
            .build());
  }

  @GetMapping("/{userId}/count")
  @Operation(
      summary = "Get total valid vouchers count for user",
      description =
          "Count the total number of valid vouchers available for a user (active, not expired, and still have usage remaining)")
  public ResponseEntity<APIResponse<Long>> getTotalValidVouchersCount(
      @Parameter(description = "User ID", required = true) @PathVariable Long userId) {
    Long count = voucherService.getTotalValidVouchersCountByUser(userId);
    return ResponseEntity.ok(
        APIResponse.<Long>builder()
            .code(200)
            .message("Get total valid vouchers count successfully")
            .result(count)
            .build());
  }
}
