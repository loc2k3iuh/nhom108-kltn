# Fix: Foreign Key Constraint Error khi xóa Order

## Lỗi gặp phải

```
DBC exception executing SQL [delete o1_0 from orders o1_0 where o1_0.id in (?)] 
[Cannot delete or update a parent row: a foreign key constraint fails 
("defaultdb"."shippings", CONSTRAINT "FK8bxet17ivvhhma7tid6k0gr8o" 
FOREIGN KEY ("order_id") REFERENCES "orders" ("id"))]
```

## Nguyên nhân

Lỗi này xảy ra khi bạn cố gắng xóa một `Order` nhưng vẫn còn các bản ghi trong các bảng con (shippings, payments, order_details) tham chiếu đến order đó thông qua foreign key.

**Vấn đề chính:** 
- Method `deleteAllByIdInBatch()` trong OrderServiceImpl sử dụng **bulk delete SQL** trực tiếp
- Bulk delete **bỏ qua JPA cascade**, không tự động xóa các entity con
- Database foreign key constraint ngăn chặn việc xóa parent row (Order)

## Giải pháp

### 1. Sửa method deleteOrders trong OrderServiceImpl

**Trước (SAI):**
```java
@Override
public void deleteOrders(List<Long> orderIds) throws Exception {
    if (orderIds == null || orderIds.isEmpty()) return;
    orderRepository.deleteAllByIdInBatch(orderIds);  // ❌ Bulk delete bỏ qua cascade
}
```

**Sau (ĐÚNG):**
```java
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
```

### 2. Tại sao giải pháp này hoạt động?

**`deleteAll(List<Order>)`** vs **`deleteAllByIdInBatch(List<Long>)`**

| Method | SQL Execution | Cascade | Performance |
|--------|--------------|---------|-------------|
| `deleteAllByIdInBatch()` | Single bulk DELETE query | ❌ No | ⚡ Fast |
| `deleteAll()` | Multiple DELETE queries | ✅ Yes | 🐌 Slower but safe |

- `deleteAll()` load entities vào memory → JPA biết về relationships → tự động xóa child entities theo cascade
- `deleteAllByIdInBatch()` thực thi raw SQL DELETE → JPA không biết → database constraint lỗi

### 3. Cascade Configuration trong Order Entity

```java
@Entity
@Table(name = "orders")
public class Order {
    // ...
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderDetail> orderDetails;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Payment payment;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Shipping shipping;
}
```

- `cascade = CascadeType.ALL` → Khi xóa Order, tự động xóa OrderDetail, Payment, Shipping
- `orphanRemoval = true` → Khi remove item khỏi collection, tự động xóa khỏi DB

## Thứ tự xóa tự động (Cascade)

Khi bạn xóa một Order, JPA sẽ tự động xóa theo thứ tự:

1. **OrderDetails** (one-to-many relationship)
2. **Payment** (one-to-one relationship)  
3. **Shipping** (one-to-one relationship)
4. **Order** (parent entity)

## Test lại chức năng

### 1. Xóa một order
```bash
DELETE /api/v1/orders/{id}
```

### 2. Xóa nhiều orders
```bash
DELETE /api/v1/orders
Body: [1, 2, 3]
```

### 3. Kiểm tra database
```sql
-- Check order đã bị xóa
SELECT * FROM orders WHERE id = 1;

-- Check shipping liên quan đã bị xóa
SELECT * FROM shippings WHERE order_id = 1;

-- Check payment liên quan đã bị xóa
SELECT * FROM payments WHERE order_id = 1;

-- Check order details liên quan đã bị xóa
SELECT * FROM order_details WHERE order_id = 1;
```

Tất cả các query trên phải trả về **0 rows** nếu cascade delete hoạt động đúng.

## Lưu ý quan trọng

### Performance Consideration
- Xóa nhiều orders có thể chậm vì phải load entities và xóa từng order
- Với số lượng lớn (>1000 orders), nên:
  1. Xóa batch nhỏ (100-200 orders/lần)
  2. Hoặc dùng stored procedure
  3. Hoặc xóa thủ công child records trước

### Alternative Solutions (Nếu cần performance cao hơn)

**Option 1: Manual Delete (Fastest)**
```java
@Transactional
public void deleteOrders(List<Long> orderIds) {
    // Delete child entities first
    orderDetailRepository.deleteByOrderIdIn(orderIds);
    paymentRepository.deleteByOrderIdIn(orderIds);
    shippingRepository.deleteByOrderIdIn(orderIds);
    
    // Then delete orders
    orderRepository.deleteAllByIdInBatch(orderIds);
}
```

**Option 2: Database Cascade (Require DB schema change)**
```sql
-- Add ON DELETE CASCADE to foreign keys
ALTER TABLE shippings
DROP FOREIGN KEY FK8bxet17ivvhhma7tid6k0gr8o;

ALTER TABLE shippings
ADD CONSTRAINT FK8bxet17ivvhhma7tid6k0gr8o
FOREIGN KEY (order_id) REFERENCES orders(id)
ON DELETE CASCADE;
```

## Best Practice

✅ **Recommended**: Sử dụng `deleteAll()` với `@Transactional` (giải pháp hiện tại)
- Safe và reliable
- JPA managed cascade
- Dễ maintain

❌ **Avoid**: Sử dụng `deleteAllByIdInBatch()` khi có relationships
- Bypass JPA lifecycle
- Foreign key constraint errors
- Data inconsistency risk

## Summary

**Problem:** Foreign key constraint error khi xóa Order  
**Root Cause:** Bulk delete bỏ qua JPA cascade  
**Solution:** Dùng `deleteAll()` thay vì `deleteAllByIdInBatch()`  
**Result:** ✅ Cascade delete hoạt động, tự động xóa child entities  

