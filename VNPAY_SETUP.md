# Hướng dẫn cấu hình VNPay Payment Gateway

## 1. Cấu hình Backend

### Thêm biến môi trường

Trong file `.env` hoặc cấu hình environment variables, thêm các thông tin VNPay:

```properties
# VNPay Configuration
VN_PAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VN_PAY_RETURN_URL=http://localhost:5173/vnpay-return
VN_PAY_API_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VN_PAY_TMN_CODE=YOUR_TMN_CODE_HERE
VN_PAY_SECRET_KEY=YOUR_SECRET_KEY_HERE
```

### Lấy thông tin VNPay

1. Đăng ký tài khoản sandbox tại: https://sandbox.vnpayment.vn/
2. Sau khi đăng ký, bạn sẽ nhận được:
   - `VN_PAY_TMN_CODE`: Mã website (Terminal ID)
   - `VN_PAY_SECRET_KEY`: Secret key để tạo checksum

### Cấu hình đã được thêm vào:

- ✅ `VnPayConfig.java` - Cấu hình và utility methods
- ✅ `VnPayController.java` - REST API endpoints
- ✅ `VnPayServiceImpl.java` - Business logic
- ✅ `VnPayRequest.java` - DTO cho request
- ✅ `application.properties` - Properties configuration

## 2. Cấu hình Frontend

### Service đã được tạo:

- ✅ `vnpayService.ts` - Service gọi API VNPay

### Components:

- ✅ `payment.tsx` - Trang thanh toán (đã tích hợp VNPay)
- ✅ `VnpayReturn.tsx` - Trang xử lý kết quả thanh toán

### Flow thanh toán VNPay:

1. User chọn phương thức thanh toán "VNPay"
2. Click "Đặt hàng"
3. Thông tin đơn hàng được lưu vào `localStorage` với key `pendingOrder`
4. Call API tạo payment URL
5. Redirect user đến VNPay gateway
6. User thanh toán trên VNPay
7. VNPay redirect về `/vnpay-return` với query params
8. Frontend đọc `pendingOrder` từ localStorage
9. Tạo đơn hàng qua API
10. Xóa giỏ hàng
11. Hiển thị kết quả

## 3. Testing

### Với Sandbox VNPay:

**Thẻ test:**
- Ngân hàng: NCB
- Số thẻ: 9704198526191432198
- Tên chủ thẻ: NGUYEN VAN A
- Ngày phát hành: 07/15
- Mật khẩu OTP: 123456

### URL endpoints:

- Create payment: `POST /api/vn-pay`
- Return URL: `GET /vnpay-return`

## 4. Production Deployment

### Cập nhật URLs:

```properties
VN_PAY_URL=https://vnpayment.vn/paymentv2/vpcpay.html
VN_PAY_RETURN_URL=https://yourdomain.com/vnpay-return
VN_PAY_API_URL=https://vnpayment.vn/paymentv2/vpcpay.html
```

### Đăng ký tài khoản production:

1. Liên hệ VNPay để đăng ký tài khoản thật
2. Hoàn thành hồ sơ pháp lý
3. Nhận thông tin TMN_CODE và SECRET_KEY chính thức

## 5. Security Notes

⚠️ **QUAN TRỌNG:**

- Không commit SECRET_KEY vào git
- Sử dụng environment variables
- Validate checksum từ VNPay return
- Log tất cả transactions để audit
- Implement timeout cho pending orders

## 6. Troubleshooting

### Lỗi thường gặp:

**1. Invalid signature/checksum:**
- Kiểm tra SECRET_KEY
- Kiểm tra thứ tự parameters khi tạo hash

**2. Return URL không hoạt động:**
- Kiểm tra CORS settings
- Verify return URL đã đăng ký với VNPay

**3. Order không được tạo sau thanh toán:**
- Kiểm tra localStorage có `pendingOrder`
- Check browser console logs
- Verify API endpoint hoạt động

## 7. API Documentation

### Create Payment

```typescript
POST /api/vn-pay
Content-Type: application/json

{
  "amount": "100000"
}

Response:
{
  "code": 200,
  "message": "Payment URL generated successfully",
  "result": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?..."
}
```

### Handle Return

```
GET /api/vn-pay/return?vnp_ResponseCode=00&vnp_TransactionStatus=00&...
```

Response codes:
- `00`: Success
- `01`: Transaction incomplete
- `02`: Transaction error
- `04`: Transaction reversed
- Other: Failed

## 8. Frontend Integration

### Import service:

```typescript
import { createVnPayPayment } from '@/services/vnpayService';
```

### Usage:

```typescript
const finalAmount = totalPrice + shippingCost - discount;
const paymentUrl = await createVnPayPayment(finalAmount);
window.location.href = paymentUrl;
```

## Support

Để được hỗ trợ:
- VNPay Hotline: 1900 55 55 77
- Email: support@vnpay.vn
- Documentation: https://sandbox.vnpayment.vn/apis/
