package iuh.fit.se.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.requests.CreateOrderRequest;
import iuh.fit.se.dtos.requests.OrderFilterRequest;
import iuh.fit.se.dtos.requests.OrderRequest;
import iuh.fit.se.dtos.responses.OrderResponse;
import iuh.fit.se.enums.OrderStatus;
import iuh.fit.se.services.interfaces.IOrderService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("${api.prefix}/orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Order Management", description = "APIs for managing orders")
public class OrderController {

  IOrderService orderService;

  @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
  @Operation(summary = "Create new order", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request)
      throws Exception {
    log.info("Creating order for user: {}", request.getUserId());
    OrderResponse response = orderService.createOrder(request);
    return APIResponse.<OrderResponse>builder()
        .result(response)
        .message("Order created successfully")
        .code(HttpStatus.CREATED.value())
        .build();
  }

  @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
  @Operation(summary = "Update order", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<OrderResponse> updateOrder(
      @PathVariable Long id, @Valid @RequestBody OrderRequest request) throws Exception {
    log.info("Updating order with ID: {}", id);
    OrderResponse response = orderService.updateOrder(id, request);
    return APIResponse.<OrderResponse>builder()
        .result(response)
        .message("Order updated successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get order by ID", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<OrderResponse> getOrderById(@PathVariable Long id) throws Exception {
    log.info("Getting order with ID: {}", id);
    OrderResponse response = orderService.getOrderById(id);
    return APIResponse.<OrderResponse>builder()
        .result(response)
        .message("Order retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping
  @Operation(
      summary = "Get all orders (paged)",
      security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<Page<OrderResponse>> getAllOrders(
      @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
    Page<OrderResponse> response = orderService.getOrders(page, size);
    return APIResponse.<Page<OrderResponse>>builder()
        .result(response)
        .message("Orders retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/user/{userId}")
  @Operation(
      summary = "Get orders by user (paged)",
      security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<Page<OrderResponse>> getOrdersByUser(
      @PathVariable Long userId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size)
      throws Exception {
    Page<OrderResponse> response = orderService.getOrdersByUserId(userId, page, size);
    return APIResponse.<Page<OrderResponse>>builder()
        .result(response)
        .message("User orders retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @PostMapping(value = "/filter", consumes = MediaType.APPLICATION_JSON_VALUE)
  @Operation(
      summary = "Filter orders (paged)",
      security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<Page<OrderResponse>> filterOrders(
      @RequestBody OrderFilterRequest filter,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(required = false) Long userId) {

    // If user is CUSTOMER, restrict to their own orders
    // Admin and Staff can filter all orders
    if (userId != null) {
      // Customer filtering their own orders
      Page<OrderResponse> response = orderService.filterOrdersByUserId(userId, filter, page, size);
      return APIResponse.<Page<OrderResponse>>builder()
          .result(response)
          .message("Filtered orders retrieved successfully")
          .code(HttpStatus.OK.value())
          .build();
    }

    // Admin/Staff filtering all orders
    Page<OrderResponse> response = orderService.filterOrders(filter, page, size);
    return APIResponse.<Page<OrderResponse>>builder()
        .result(response)
        .message("Filtered orders retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @PostMapping("/status")
  @Operation(
      summary = "Bulk update order status",
      security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('STAFF')  or hasRole('ADMIN')")
  public APIResponse<List<OrderResponse>> updateOrdersStatus(
      @RequestParam("status") String status, @RequestBody List<Long> orderIds) throws Exception {
    OrderStatus parsed = OrderStatus.valueOf(status.toUpperCase());
    List<OrderResponse> updated = orderService.updateOrdersStatus(orderIds, parsed);
    return APIResponse.<List<OrderResponse>>builder()
        .result(updated)
        .message("Orders' status updated successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @DeleteMapping
  @Operation(summary = "Bulk delete orders", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<Void> deleteOrders(@RequestBody List<Long> orderIds) throws Exception {
    orderService.deleteOrders(orderIds);
    return APIResponse.<Void>builder()
        .message("Orders deleted successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @PostMapping("/sample")
  @Operation(
      summary = "Generate sample orders",
      security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<Integer> generateSampleOrders(@RequestParam(defaultValue = "10") int count)
      throws Exception {
    int created = orderService.generateSampleOrders(count);
    return APIResponse.<Integer>builder()
        .result(created)
        .message("Sample orders generated successfully")
        .code(HttpStatus.CREATED.value())
        .build();
  }

  @PostMapping(value = "/pdfs", consumes = MediaType.APPLICATION_JSON_VALUE)
  @Operation(
      summary = "Generate order PDFs (list of Base64)",
      security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<List<byte[]>> generateOrderPdfs(@RequestBody List<Long> orderIds)
      throws Exception {
    List<byte[]> pdfs = orderService.generateOrderPdfs(orderIds);
    return APIResponse.<List<byte[]>>builder()
        .result(pdfs)
        .message("Order PDFs generated successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @PostMapping(value = "/pdfs/merge", consumes = MediaType.APPLICATION_JSON_VALUE)
  @Operation(
      summary = "Merge multiple order PDFs into a single PDF file",
      description = "Generate and merge PDFs for multiple orders into one combined PDF document",
      security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
  public ResponseEntity<byte[]> mergeOrderPdfs(@RequestBody List<Long> orderIds) throws Exception {
    byte[] mergedPdf = orderService.mergeOrderPdfs(orderIds);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_PDF);
    headers.setContentDisposition(
        org.springframework.http.ContentDisposition.builder("attachment")
            .filename("merged-orders-" + System.currentTimeMillis() + ".pdf")
            .build());
    headers.setContentLength(mergedPdf.length);

    return new ResponseEntity<>(mergedPdf, headers, HttpStatus.OK);
  }

  @GetMapping("/user/{userId}/total-spent")
  @Operation(
      summary = "Get total amount spent by user for completed orders",
      description =
          "Calculate the total amount (finalAmount) that a user has spent across all completed orders",
      security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<java.math.BigDecimal> getTotalSpentByUser(@PathVariable Long userId)
      throws Exception {
    log.info("Getting total spent amount for user: {}", userId);
    java.math.BigDecimal totalSpent = orderService.getTotalSpentByUser(userId);
    return APIResponse.<java.math.BigDecimal>builder()
        .result(totalSpent)
        .message("Total spent amount retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/user/{userId}/total-orders")
  @Operation(
      summary = "Get total number of orders by user excluding cancelled orders",
      description =
          "Calculate the total count of orders for a user, excluding orders with CANCELLED status",
      security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<Long> getTotalOrdersCountByUser(@PathVariable Long userId) throws Exception {
    log.info("Getting total orders count for user: {}", userId);
    Long totalOrders = orderService.getTotalOrdersCountByUser(userId);
    return APIResponse.<Long>builder()
        .result(totalOrders)
        .message("Total orders count retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }
}
