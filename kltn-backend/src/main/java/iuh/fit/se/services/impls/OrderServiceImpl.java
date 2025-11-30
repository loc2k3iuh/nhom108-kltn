package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.*;
import iuh.fit.se.dtos.responses.OrderResponse;
import iuh.fit.se.entities.Order;
import iuh.fit.se.entities.OrderDetail;
import iuh.fit.se.entities.Payment;
import iuh.fit.se.entities.ProductVariant;
import iuh.fit.se.entities.Shipping;
import iuh.fit.se.entities.User;
import iuh.fit.se.enums.OrderStatus;
import iuh.fit.se.enums.ShippingStatus;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.repositories.OrderRepository;
import iuh.fit.se.repositories.ProductVariantRepository;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.services.interfaces.IEmailService;
import iuh.fit.se.services.interfaces.IOrderService;
import iuh.fit.se.services.interfaces.IPriceService;
import iuh.fit.se.services.interfaces.IVoucherService;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderServiceImpl implements IOrderService {

  OrderRepository orderRepository;
  UserRepository userRepository;
  ProductVariantRepository productVariantRepository;
  IVoucherService voucherService;
  IPriceService priceService;
  IEmailService emailService;

  private OrderResponse toOrderResponse(Order order) {
    if (order == null) return null;
    OrderResponse.OrderResponseBuilder builder =
        OrderResponse.builder()
            .id(order.getId())
            .invoiceUrl(order.getPdfUrl())
            .userId(order.getUser() != null ? order.getUser().getId() : null)
            .status(order.getOrderStatus() != null ? order.getOrderStatus().name() : null)
            .orderDate(
                order.getCreatedAt() != null
                    ? order.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME)
                    : null);

    // Map Shipping info
    Shipping shipping = order.getShipping();
    if (shipping != null) {
      builder
          .fullName(shipping.getReceiverName())
          .phoneNumber(shipping.getReceiverPhone())
          .address(shipping.getAddress())
          .city(shipping.getCity())
          .district(shipping.getDistrict())
          .ward(shipping.getWard())
          .shippingMethod(shipping.getMethod() != null ? shipping.getMethod().name() : null)
          .shippingCost(
              shipping.getShippingCost() != null ? shipping.getShippingCost().longValue() : 0L);
    }

    // Map Payment info
    Payment payment = order.getPayment();
    if (payment != null) {
      builder.paymentMethod(payment.getMethod() != null ? payment.getMethod().name() : null);
    }

    // Map voucher code
    builder.discountCode(order.getVoucherCode());

    // Map amounts
    builder
        .totalAmount(order.getTotalAmount())
        .discountAmount(order.getDiscountAmount())
        .finalAmount(order.getFinalAmount())
        .note(order.getNote());

    // Map details
    List<OrderDetailRequest> detailResponses = new ArrayList<>();
    List<OrderDetail> details = order.getOrderDetails();
    if (details != null) {
      for (OrderDetail d : details) {
        OrderDetailRequest od = new OrderDetailRequest();
        od.setOrderId(order.getId());
        if (d.getProductVariant() != null) {
          if (d.getProductVariant().getProduct() != null) {
            od.setProductId(d.getProductVariant().getProduct().getId());
            od.setProductName(d.getProductVariant().getProduct().getName());
          }
          od.setImageUrl(d.getProductVariant().getImageUrl());
          if (d.getProductVariant().getStockQuantity() != null) {
            od.setStockQuantity(d.getProductVariant().getStockQuantity().longValue());
          }
        }
        if (d.getQuantity() != null) od.setQuantity(d.getQuantity().longValue());
        if (d.getPrice() != null) od.setPrice(d.getPrice().longValue());
        detailResponses.add(od);
      }
    }
    builder.orderDetails(detailResponses);

    return builder.build();
  }

  @Override
  public List<OrderResponse> getAllOrders() {
    return orderRepository.findAll().stream()
        .map(this::toOrderResponse)
        .collect(Collectors.toList());
  }

  @Override
  public OrderResponse getOrderById(Long id) throws Exception {
    Order order =
        orderRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.INVALID_INPUT, "Order not found: " + id));
    return toOrderResponse(order);
  }

  @Override
  public Page<OrderResponse> getOrdersByUserId(Long userId, int page, int size) throws Exception {
    Pageable pageable = PageRequest.of(page, size);
    Page<Order> orders = orderRepository.findByUserId(userId, pageable);
    List<OrderResponse> content =
        orders.getContent().stream().map(this::toOrderResponse).collect(Collectors.toList());
    return new PageImpl<>(content, pageable, orders.getTotalElements());
  }

  @Override
  public Page<OrderResponse> getOrders(int page, int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<Order> orders = orderRepository.findAll(pageable);
    List<OrderResponse> content =
        orders.getContent().stream().map(this::toOrderResponse).collect(Collectors.toList());
    return new PageImpl<>(content, pageable, orders.getTotalElements());
  }

  @Override
  public Page<OrderResponse> filterOrders(OrderFilterRequest filter, int page, int size) {
    Pageable pageable = PageRequest.of(page, size);

    Specification<Order> spec =
        (root, query, cb) -> {
          List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
          if (filter == null)
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));

          if (filter.getId() != null) {
            predicates.add(cb.equal(root.get("id"), filter.getId()));
          }
          if (filter.getStatus() != null && !filter.getStatus().isEmpty()) {
            // Map filter statuses to entity's orderStatus field
            predicates.add(root.get("orderStatus").in(filter.getStatus()));
          }
          return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

    Page<Order> orders = orderRepository.findAll(spec, pageable);
    List<OrderResponse> content =
        orders.getContent().stream().map(this::toOrderResponse).collect(Collectors.toList());
    return new PageImpl<>(content, pageable, orders.getTotalElements());
  }

  @Override
  public Page<OrderResponse> filterOrdersByUserId(
      Long userId, OrderFilterRequest filter, int page, int size) {
    // Sort by createdAt descending (newest first) by default
    Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

    Specification<Order> spec =
        (root, query, cb) -> {
          List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();

          // Always filter by userId first
          predicates.add(cb.equal(root.get("user").get("id"), userId));

          if (filter != null) {
            if (filter.getId() != null) {
              predicates.add(cb.equal(root.get("id"), filter.getId()));
            }
            if (filter.getStatus() != null && !filter.getStatus().isEmpty()) {
              predicates.add(root.get("orderStatus").in(filter.getStatus()));
            }
          }

          return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

    Page<Order> orders = orderRepository.findAll(spec, pageable);
    List<OrderResponse> content =
        orders.getContent().stream().map(this::toOrderResponse).collect(Collectors.toList());
    return new PageImpl<>(content, pageable, orders.getTotalElements());
  }

  @Override
  public int generateSampleOrders(int count) throws Exception {
    // Not supported without clear business rules
    return 0;
  }

  @Override
  public List<byte[]> generateOrderPdfs(List<Long> orderIds) throws Exception {
    if (orderIds == null || orderIds.isEmpty()) {
      return List.of();
    }

    List<byte[]> pdfList = new ArrayList<>();
    for (Long orderId : orderIds) {
      OrderResponse orderResponse = getOrderById(orderId);
      // Generate PDF for each order using email service
      byte[] pdfBytes = emailService.generateOrderPdfBytes(orderResponse);
      if (pdfBytes != null && pdfBytes.length > 0) {
        pdfList.add(pdfBytes);
      }
    }
    return pdfList;
  }

  @Override
  public byte[] mergeOrderPdfs(List<Long> orderIds) throws Exception {
    if (orderIds == null || orderIds.isEmpty()) {
      throw new AppException(ErrorCode.INVALID_INPUT, "Order IDs list cannot be empty");
    }

    log.info("Merging PDFs for {} orders", orderIds.size());

    // Generate individual PDFs for each order
    List<byte[]> pdfBytesList = new ArrayList<>();
    for (Long orderId : orderIds) {
      try {
        OrderResponse orderResponse = getOrderById(orderId);
        byte[] pdfBytes = emailService.generateOrderPdfBytes(orderResponse);

        if (pdfBytes != null && pdfBytes.length > 0) {
          pdfBytesList.add(pdfBytes);
          log.debug("Generated PDF for order ID: {} ({} bytes)", orderId, pdfBytes.length);
        } else {
          log.warn("Could not generate PDF for order ID: {}", orderId);
        }
      } catch (Exception e) {
        log.error("Error generating PDF for order ID: {}", orderId, e);
        // Continue with other orders instead of failing completely
      }
    }

    if (pdfBytesList.isEmpty()) {
      throw new AppException(
          ErrorCode.INVALID_INPUT, "No valid PDFs could be generated from the provided order IDs");
    }

    // Merge all PDFs into one
    byte[] mergedPdf = iuh.fit.se.utils.PdfUtils.mergePdfBytes(pdfBytesList);
    log.info(
        "Successfully merged {} PDFs into one file ({} bytes)",
        pdfBytesList.size(),
        mergedPdf.length);

    return mergedPdf;
  }

  @Override
  public List<OrderResponse> updateOrdersStatus(List<Long> orderIds, OrderStatus status)
      throws Exception {
    if (orderIds == null || orderIds.isEmpty()) return List.of();
    List<Order> orders = orderRepository.findAllById(orderIds);
    for (Order o : orders) {
      if (o != null) {
        o.setOrderStatus(status);
      }
    }
    List<Order> saved = orderRepository.saveAll(orders);
    return saved.stream().map(this::toOrderResponse).collect(Collectors.toList());
  }

  @Override
  @Transactional
  public void deleteOrders(List<Long> orderIds) throws Exception {
    if (orderIds == null || orderIds.isEmpty()) return;

    // Fetch all orders first to ensure they exist and cascade delete works properly
    List<Order> ordersToDelete = orderRepository.findAllById(orderIds);

    if (ordersToDelete.isEmpty()) {
      log.warn("No orders found for the provided IDs");
      return;
    }

    // Delete each order individually to trigger cascade delete for child entities
    // (shipping, payment, orderDetails)
    orderRepository.deleteAll(ordersToDelete);

    log.info("Successfully deleted {} orders", ordersToDelete.size());
  }

  @Override
  @Transactional(isolation = Isolation.READ_COMMITTED)
  public OrderResponse createOrder(CreateOrderRequest request) throws Exception {
    if (request == null) {
      throw new AppException(ErrorCode.INVALID_INPUT, "Request cannot be null");
    }
    if (request.getUserId() == null) {
      throw new AppException(ErrorCode.INVALID_INPUT, "User id is required");
    }
    if (request.getItems() == null || request.getItems().isEmpty()) {
      throw new AppException(ErrorCode.INVALID_INPUT, "Order items cannot be empty");
    }

    User user =
        userRepository
            .findById(request.getUserId())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

    Order order = new Order();
    order.setUser(user);
    order.setOrderStatus(OrderStatus.PENDING);

    List<OrderDetail> details = new ArrayList<>();
    BigDecimal totalAmount = BigDecimal.ZERO;

    for (CreateOrderItemRequest item : request.getItems()) {
      if (item.getProductVariantId() == null) {
        throw new AppException(ErrorCode.INVALID_INPUT, "product_variant_id is required");
      }
      if (item.getQuantity() == null || item.getQuantity() <= 0) {
        throw new AppException(ErrorCode.INVALID_QUANTITY);
      }

      // Use pessimistic lock to prevent concurrent updates and deadlocks
      ProductVariant variant =
          productVariantRepository
              .findByIdWithLock(item.getProductVariantId())
              .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND));

      if (variant.getStockQuantity() == null || variant.getStockQuantity() < item.getQuantity()) {
        throw new AppException(ErrorCode.PRODUCT_VARIANT_OUT_OF_STOCK);
      }

      // Get final price with discount applied
      double finalPriceValue = priceService.getFinalPrice(variant.getProduct(), variant);
      BigDecimal price = BigDecimal.valueOf(finalPriceValue);
      BigDecimal lineTotal = price.multiply(BigDecimal.valueOf(item.getQuantity()));

      OrderDetail detail =
          OrderDetail.builder()
              .order(order)
              .productVariant(variant)
              .quantity(item.getQuantity())
              .price(price)
              .totalPrice(lineTotal)
              .build();
      details.add(detail);

      totalAmount = totalAmount.add(lineTotal);

      // decrease stock
      variant.setStockQuantity(variant.getStockQuantity() - item.getQuantity());
    }

    order.setOrderDetails(details);
    order.setTotalAmount(totalAmount);
    order.setDiscountAmount(BigDecimal.ZERO);
    order.setNote(request.getNote());

    // Calculate final amount with shipping cost
    BigDecimal finalAmount = totalAmount.add(request.getShippingFee());
    order.setFinalAmount(finalAmount);

    // Apply voucher if provided
    Long appliedVoucherId = null;
    if (request.getDiscountCode() != null && !request.getDiscountCode().isBlank()) {
      var code = request.getDiscountCode().trim();
      iuh.fit.se.services.interfaces.IVoucherService.VoucherApplyResult result =
          voucherService.validateAndCalculate(request.getUserId(), code, totalAmount);
      order.setVoucherCode(code);
      order.setDiscountAmount(result.discountAmount);
      // Final amount = totalAmount + shippingCost - voucherDiscount
      finalAmount = totalAmount.add(request.getShippingFee()).subtract(result.discountAmount);
      order.setFinalAmount(finalAmount);
      appliedVoucherId = result.voucher.getId();
    }

    // Shipping
    Shipping shipping =
        Shipping.builder()
            .order(order)
            .receiverName(request.getReceiverName())
            .receiverPhone(request.getReceiverPhone())
            .address(request.getAddress())
            .city(request.getCity())
            .district(request.getDistrict())
            .ward(request.getWard())
            .method(request.getShippingMethod())
            .status(ShippingStatus.PENDING)
            .shippingCost(request.getShippingFee())
            .build();
    order.setShipping(shipping);

    // Payment
    Payment payment =
        Payment.builder()
            .order(order)
            .method(request.getPaymentMethod())
            .amount(order.getFinalAmount())
            .build();
    order.setPayment(payment);

    // persist order with cascade
    Order saved = orderRepository.save(order);

    // record voucher usage after successful save
    if (appliedVoucherId != null) {
      voucherService.recordUsage(request.getUserId(), appliedVoucherId);
    }

    // persist updated variants' stock
    productVariantRepository.saveAll(
        details.stream().map(OrderDetail::getProductVariant).collect(Collectors.toList()));

    OrderResponse orderResponse = toOrderResponse(saved);

    // Send order confirmation email asynchronously
    emailService.sendOrderConfirmation(orderResponse);
    log.info("Order confirmation email queued for order: {}", saved.getId());

    return orderResponse;
  }

  @Override
  @Transactional
  public OrderResponse updateOrder(Long id, OrderRequest orderDTO) throws Exception {
    if (orderDTO == null) {
      throw new AppException(ErrorCode.INVALID_INPUT, "Request cannot be null");
    }

    Order order =
        orderRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.INVALID_INPUT, "Order not found: " + id));

    // Check if order is completed - cannot update completed orders
    if (order.getOrderStatus() == OrderStatus.COMPLETED
        || order.getOrderStatus() == OrderStatus.CANCELLED) {
      throw new AppException(
          ErrorCode.INVALID_INPUT, "Cannot update order with COMPLETED or CANCELLED status");
    }

    // Update order status
    if (orderDTO.getOrderStatus() != null) {
      order.setOrderStatus(orderDTO.getOrderStatus());
    }

    // Update note
    if (orderDTO.getNote() != null) {
      order.setNote(orderDTO.getNote());
    }

    // Update shipping information if exists
    Shipping shipping = order.getShipping();
    if (shipping != null) {
      if (orderDTO.getReceiverName() != null) {
        shipping.setReceiverName(orderDTO.getReceiverName());
      }
      if (orderDTO.getReceiverPhone() != null) {
        shipping.setReceiverPhone(orderDTO.getReceiverPhone());
      }
      if (orderDTO.getAddress() != null) {
        shipping.setAddress(orderDTO.getAddress());
      }
      if (orderDTO.getCity() != null) {
        shipping.setCity(orderDTO.getCity());
      }
      if (orderDTO.getDistrict() != null) {
        shipping.setDistrict(orderDTO.getDistrict());
      }
      if (orderDTO.getWard() != null) {
        shipping.setWard(orderDTO.getWard());
      }
      if (orderDTO.getShippingMethod() != null) {
        shipping.setMethod(orderDTO.getShippingMethod());
      }
      if (orderDTO.getShippingStatus() != null) {
        shipping.setStatus(orderDTO.getShippingStatus());
        // Update shipping timestamps based on status
        if (orderDTO.getShippingStatus() == ShippingStatus.SHIPPING
            && shipping.getShippedAt() == null) {
          shipping.setShippedAt(java.time.LocalDateTime.now());
        }
        if (orderDTO.getShippingStatus() == ShippingStatus.DELIVERED
            && shipping.getDeliveredAt() == null) {
          shipping.setDeliveredAt(java.time.LocalDateTime.now());
        }
      }
      if (orderDTO.getTrackingCode() != null) {
        shipping.setTrackingCode(orderDTO.getTrackingCode());
      }
      if (orderDTO.getShippingCost() != null) {
        BigDecimal oldShippingCost = shipping.getShippingCost();
        shipping.setShippingCost(orderDTO.getShippingCost());
        // Recalculate final amount if shipping cost changed
        if (!oldShippingCost.equals(orderDTO.getShippingCost())) {
          BigDecimal newFinalAmount =
              order
                  .getTotalAmount()
                  .subtract(
                      order.getDiscountAmount() != null
                          ? order.getDiscountAmount()
                          : BigDecimal.ZERO)
                  .add(orderDTO.getShippingCost());
          order.setFinalAmount(newFinalAmount);
          // Update payment amount
          if (order.getPayment() != null) {
            order.getPayment().setAmount(newFinalAmount);
          }
        }
      }
    }

    // Update payment information if exists
    Payment payment = order.getPayment();
    if (payment != null) {
      if (orderDTO.getPaymentMethod() != null) {
        payment.setMethod(orderDTO.getPaymentMethod());
      }
      if (orderDTO.getTransactionId() != null) {
        payment.setTransactionId(orderDTO.getTransactionId());
        // If transaction ID is set, mark as paid
        if (payment.getPaidAt() == null) {
          payment.setPaidAt(java.time.LocalDateTime.now());
        }
      }
    }

    // Save the updated order
    Order savedOrder = orderRepository.save(order);

    log.info("Order {} has been updated successfully", id);
    return toOrderResponse(savedOrder);
  }

  @Override
  public BigDecimal getTotalSpentByUser(Long userId) throws Exception {
    // Verify user exists
    if (!userRepository.existsById(userId)) {
      throw new AppException(ErrorCode.INVALID_INPUT, "User not found: " + userId);
    }

    log.info("Getting total spent amount for user: {}", userId);
    BigDecimal totalSpent = orderRepository.getTotalAmountByUserIdAndCompletedStatus(userId);

    log.info("Total spent by user {}: {}", userId, totalSpent);
    return totalSpent;
  }

  @Override
  public Long getTotalOrdersCountByUser(Long userId) throws Exception {
    // Verify user exists
    if (!userRepository.existsById(userId)) {
      throw new AppException(ErrorCode.INVALID_INPUT, "User not found: " + userId);
    }

    log.info("Getting total orders count for user: {}", userId);
    Long totalOrders = orderRepository.countOrdersByUserIdExcludingCancelled(userId);

    log.info("Total orders count by user {} (excluding cancelled): {}", userId, totalOrders);
    return totalOrders;
  }
}
