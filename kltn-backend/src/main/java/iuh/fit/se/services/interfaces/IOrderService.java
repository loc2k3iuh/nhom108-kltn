package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.CreateOrderRequest;
import iuh.fit.se.dtos.requests.OrderFilterRequest;
import iuh.fit.se.dtos.requests.OrderRequest;
import iuh.fit.se.dtos.responses.OrderResponse;
import iuh.fit.se.enums.OrderStatus;
import java.util.List;
import org.springframework.data.domain.Page;

public interface IOrderService {

  List<OrderResponse> getAllOrders();

  OrderResponse getOrderById(Long id) throws Exception;

  Page<OrderResponse> getOrdersByUserId(Long userId, int page, int size) throws Exception;

  Page<OrderResponse> getOrders(int page, int size);

  Page<OrderResponse> filterOrders(OrderFilterRequest filter, int page, int size);

  Page<OrderResponse> filterOrdersByUserId(
      Long userId, OrderFilterRequest filter, int page, int size);

  int generateSampleOrders(int count) throws Exception;

  List<byte[]> generateOrderPdfs(List<Long> orderIds) throws Exception;

  /**
   * Merge multiple order PDFs into a single PDF file.
   *
   * @param orderIds list of order IDs whose PDFs should be merged
   * @return merged PDF as byte array
   * @throws Exception if any error occurs during PDF generation or merging
   */
  byte[] mergeOrderPdfs(List<Long> orderIds) throws Exception;

  List<OrderResponse> updateOrdersStatus(List<Long> orderIds, OrderStatus status) throws Exception;

  void deleteOrders(List<Long> orderIds) throws Exception;

  // Create a new order
  OrderResponse createOrder(CreateOrderRequest request) throws Exception;

  OrderResponse updateOrder(Long id, OrderRequest orderDTO) throws Exception;
}
