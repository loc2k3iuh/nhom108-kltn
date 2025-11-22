# API Cập Nhật Đơn Hàng (Order Update API)

## Tổng Quan
API này cho phép cập nhật thông tin đơn hàng đã tạo, bao gồm:
- Trạng thái đơn hàng
- Thông tin vận chuyển
- Thông tin thanh toán
- Ghi chú đơn hàng

**Lưu ý:** Không thể cập nhật danh sách sản phẩm hoặc mã voucher sau khi đơn hàng đã được tạo. Nếu cần thay đổi, phải hủy đơn hàng và tạo lại.

## Endpoint

### PUT /api/v1/orders/{id}

**Quyền truy cập:** ADMIN, STAFF

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

## Request Body

```json
{
  "order_status": "PENDING|PROCESSING|SHIPPING|DELIVERED|CANCELLED",
  "note": "Ghi chú đơn hàng",
  
  // Thông tin vận chuyển
  "receiver_name": "Tên người nhận",
  "receiver_phone": "Số điện thoại người nhận",
  "address": "Địa chỉ cụ thể",
  "city": "Thành phố",
  "district": "Quận/Huyện",
  "ward": "Phường/Xã",
  "shipping_method": "STANDARD|EXPRESS|SAME_DAY",
  "shipping_status": "PENDING|SHIPPING|DELIVERED|FAILED",
  "shipping_cost": 30000,
  "tracking_code": "TRACK123456789",
  
  // Thông tin thanh toán
  "payment_method": "COD|BANK_TRANSFER|VNPAY|MOMO",
  "transaction_id": "TXN123456789"
}
```

**Tất cả các trường đều optional** - chỉ gửi các trường cần cập nhật.

## Response

```json
{
  "code": 200,
  "message": "Order updated successfully",
  "result": {
    "id": 1,
    "userId": 123,
    "status": "PROCESSING",
    "orderDate": "2025-11-12T10:30:00",
    "fullName": "Nguyễn Văn A",
    "phoneNumber": "0901234567",
    "address": "123 Đường ABC",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 1",
    "ward": "Phường Bến Nghé",
    "shippingMethod": "EXPRESS",
    "shippingCost": 30000,
    "paymentMethod": "VNPAY",
    "discountCode": "SUMMER2024",
    "totalAmount": 500000,
    "discountAmount": 50000,
    "finalAmount": 480000,
    "note": "Giao giờ hành chính",
    "orderDetails": [...]
  }
}
```

## Các Tính Năng Đặc Biệt

### 1. Tự Động Cập Nhật Timestamp
- Khi `shipping_status` được cập nhật thành `SHIPPING`, hệ thống tự động ghi nhận `shippedAt`
- Khi `shipping_status` được cập nhật thành `DELIVERED`, hệ thống tự động ghi nhận `deliveredAt`
- Khi `transaction_id` được cập nhật, hệ thống tự động ghi nhận `paidAt`

### 2. Tính Toán Lại Tổng Tiền
Khi `shipping_cost` thay đổi, hệ thống tự động:
- Tính toán lại `finalAmount` = `totalAmount` - `discountAmount` + `shippingCost`
- Cập nhật `payment.amount` theo `finalAmount` mới

### 3. Partial Update
API hỗ trợ partial update - chỉ cần gửi các trường muốn thay đổi, các trường khác giữ nguyên.

## Ví Dụ Sử Dụng

### 1. Cập Nhật Trạng Thái Đơn Hàng

```bash
curl -X PUT http://localhost:8080/api/v1/orders/1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "order_status": "PROCESSING"
  }'
```

### 2. Cập Nhật Thông Tin Vận Chuyển

```bash
curl -X PUT http://localhost:8080/api/v1/orders/1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_status": "SHIPPING",
    "tracking_code": "VNP123456789"
  }'
```

### 3. Cập Nhật Thông Tin Thanh Toán

```bash
curl -X PUT http://localhost:8080/api/v1/orders/1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "TXN987654321"
  }'
```

### 4. Cập Nhật Địa Chỉ Giao Hàng

```bash
curl -X PUT http://localhost:8080/api/v1/orders/1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "receiver_name": "Trần Thị B",
    "receiver_phone": "0907654321",
    "address": "456 Đường XYZ",
    "city": "Hà Nội",
    "district": "Quận Ba Đình",
    "ward": "Phường Điện Biên"
  }'
```

### 5. Cập Nhật Phí Ship

```bash
curl -X PUT http://localhost:8080/api/v1/orders/1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_cost": 50000
  }'
```

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Request cannot be null | Request body rỗng |
| 404 | Order not found | Không tìm thấy đơn hàng với ID đã cho |
| 401 | Unauthorized | Chưa đăng nhập |
| 403 | Forbidden | Không có quyền cập nhật đơn hàng |

## Enums

### OrderStatus
- `PENDING` - Chờ xác nhận
- `PROCESSING` - Đang xử lý
- `SHIPPING` - Đang giao hàng
- `DELIVERED` - Đã giao hàng
- `CANCELLED` - Đã hủy

### ShippingStatus
- `PENDING` - Chờ gửi hàng
- `SHIPPING` - Đang vận chuyển
- `DELIVERED` - Đã giao hàng
- `FAILED` - Giao hàng thất bại

### ShippingMethod
- `STANDARD` - Giao hàng tiêu chuẩn
- `EXPRESS` - Giao hàng nhanh
- `SAME_DAY` - Giao hàng trong ngày

### PaymentMethod
- `COD` - Thanh toán khi nhận hàng
- `BANK_TRANSFER` - Chuyển khoản ngân hàng
- `VNPAY` - Ví VNPay
- `MOMO` - Ví MoMo

## Ghi Chú Kỹ Thuật

1. **Transaction Management:** Method `updateOrder` được đánh dấu `@Transactional` để đảm bảo tính toàn vẹn dữ liệu.

2. **Cascade Update:** Thay đổi thông tin shipping và payment được cascade update tự động nhờ quan hệ OneToOne.

3. **Logging:** Mọi thay đổi đều được ghi log để dễ dàng debug và audit.

4. **Validation:** Sử dụng các ràng buộc từ entity để đảm bảo dữ liệu hợp lệ trước khi lưu.

## Hạn Chế

- Không thể thay đổi danh sách sản phẩm trong đơn hàng
- Không thể thay đổi mã voucher đã áp dụng
- Không thể thay đổi user_id (người đặt hàng)
- Một số trường như `created_at` được quản lý tự động và không thể cập nhật

