package iuh.fit.se.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.requests.CreateVoucherRequest;
import iuh.fit.se.dtos.requests.UpdateVoucherRequest;
import iuh.fit.se.dtos.responses.VoucherResponse;
import iuh.fit.se.services.interfaces.IVoucherService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("${api.prefix}/vouchers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Voucher Management", description = "APIs for managing vouchers (Admin)")
public class VoucherController {

  IVoucherService voucherService;

  @PostMapping
  @Operation(summary = "Create new voucher", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<VoucherResponse> createVoucher(
      @Valid @RequestBody CreateVoucherRequest request) {
    log.info("Creating voucher with code: {}", request.getCode());
    VoucherResponse response = voucherService.createVoucher(request);
    return APIResponse.<VoucherResponse>builder()
        .result(response)
        .message("Voucher created successfully")
        .code(HttpStatus.CREATED.value())
        .build();
  }

  @PutMapping("/{id}")
  @Operation(summary = "Update voucher", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<VoucherResponse> updateVoucher(
      @Parameter(description = "Voucher ID", required = true) @PathVariable Long id,
      @Valid @RequestBody UpdateVoucherRequest request) {
    log.info("Updating voucher with ID: {}", id);
    VoucherResponse response = voucherService.updateVoucher(id, request);
    return APIResponse.<VoucherResponse>builder()
        .result(response)
        .message("Voucher updated successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Delete voucher", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN')")
  public APIResponse<Void> deleteVoucher(
      @Parameter(description = "Voucher ID", required = true) @PathVariable Long id) {
    log.info("Deleting voucher with ID: {}", id);
    voucherService.deleteVoucher(id);
    return APIResponse.<Void>builder()
        .message("Voucher deleted successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get voucher by ID", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<VoucherResponse> getVoucherById(
      @Parameter(description = "Voucher ID", required = true) @PathVariable Long id) {
    log.info("Getting voucher with ID: {}", id);
    VoucherResponse response = voucherService.getVoucherById(id);
    return APIResponse.<VoucherResponse>builder()
        .result(response)
        .message("Voucher retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping
  @Operation(
      summary = "Get all vouchers with pagination, search and filter",
      description =
          "Search by voucher code or description. Filter by discount type (PERCENT or FIXED). Leave parameters empty to get all vouchers.",
      security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<Page<VoucherResponse>> getAllVouchers(
      @Parameter(description = "Search keyword for voucher code or description")
          @RequestParam(required = false)
          String keyword,
      @Parameter(description = "Filter by discount type (PERCENT or FIXED)")
          @RequestParam(required = false)
          String discountType,
      @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
      @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
      @Parameter(description = "Sort field") @RequestParam(defaultValue = "createdDate")
          String sortBy,
      @Parameter(description = "Sort direction (asc/desc)") @RequestParam(defaultValue = "desc")
          String sortDir) {
    log.info(
        "Getting all vouchers - keyword: {}, discountType: {}, page: {}, size: {}, sortBy: {}, sortDir: {}",
        keyword,
        discountType,
        page,
        size,
        sortBy,
        sortDir);

    Page<VoucherResponse> response =
        voucherService.getAllVouchers(keyword, discountType, page, size, sortBy, sortDir);
    return APIResponse.<Page<VoucherResponse>>builder()
        .result(response)
        .message("Vouchers retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }
}

