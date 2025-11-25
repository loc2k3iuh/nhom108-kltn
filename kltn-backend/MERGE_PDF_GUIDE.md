# Hướng dẫn sử dụng chức năng gộp PDF hóa đơn

## Mô tả
Chức năng này cho phép gộp nhiều file PDF hóa đơn thành một file PDF duy nhất.

## API Endpoint

### POST `/api/v1/orders/pdfs/merge`

Endpoint này nhận danh sách các ID đơn hàng và trả về một file PDF đã được gộp.

**Quyền truy cập:** Chỉ ADMIN hoặc STAFF

**Request Body:**
```json
[1, 2, 3, 4, 5]
```

**Response:**
- Content-Type: `application/pdf`
- File PDF được download tự động với tên: `merged-orders-{timestamp}.pdf`

## Cách sử dụng

### 1. Sử dụng với Postman

1. Tạo request POST đến: `http://localhost:8080/api/v1/orders/pdfs/merge`
2. Thêm Bearer Token vào Header (với role ADMIN hoặc STAFF)
3. Trong Body, chọn "raw" và "JSON", nhập:
   ```json
   [1, 2, 3]
   ```
4. Click "Send"
5. File PDF sẽ được download tự động

### 2. Sử dụng với cURL

```bash
curl -X POST "http://localhost:8080/api/v1/orders/pdfs/merge" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "[1, 2, 3]" \
  --output merged-orders.pdf
```

### 3. Sử dụng với JavaScript/Fetch

```javascript
const orderIds = [1, 2, 3];

fetch('http://localhost:8080/api/v1/orders/pdfs/merge', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(orderIds)
})
.then(response => response.blob())
.then(blob => {
  // Tạo link download
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `merged-orders-${Date.now()}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
})
.catch(error => console.error('Error:', error));
```

## Cấu trúc code

### 1. PdfUtils.java
Utility class chứa method `mergePdfBytes()` để gộp nhiều PDF byte arrays thành một.

**Location:** `src/main/java/iuh/fit/se/utils/PdfUtils.java`

### 2. IOrderService.java
Interface định nghĩa method `mergeOrderPdfs()`.

**Location:** `src/main/java/iuh/fit/se/services/interfaces/IOrderService.java`

### 3. OrderServiceImpl.java
Implement logic:
1. Generate PDF cho từng đơn hàng
2. Gộp tất cả PDF lại thành một file
3. Return byte array của PDF đã gộp

**Location:** `src/main/java/iuh/fit/se/services/impls/OrderServiceImpl.java`

### 4. OrderController.java
REST endpoint để client gọi chức năng merge PDF.

**Location:** `src/main/java/iuh/fit/se/controllers/OrderController.java`

## Dependencies

Project sử dụng Apache PDFBox để gộp PDF:

```gradle
implementation 'org.apache.pdfbox:pdfbox:2.0.31'
```

## Xử lý lỗi

- Nếu danh sách orderIds rỗng → Trả về lỗi `INVALID_INPUT`
- Nếu không tạo được PDF cho bất kỳ đơn hàng nào → Trả về lỗi `INVALID_INPUT`
- Nếu có lỗi khi tạo PDF cho một số đơn hàng → Log warning và tiếp tục với các đơn hàng khác

## Lưu ý

1. Chức năng này yêu cầu quyền ADMIN hoặc STAFF
2. PDF được tạo từ template `order-confirmation-pdf.html`
3. Mỗi đơn hàng sẽ là một trang riêng trong file PDF đã gộp
4. File PDF được trả về trực tiếp, không lưu vào server hoặc S3

## Test

Để test chức năng:

1. Tạo một số đơn hàng test trong hệ thống
2. Lấy ID của các đơn hàng đó
3. Gọi API merge với danh sách ID
4. Kiểm tra file PDF được download có chứa đầy đủ các hóa đơn không

## Troubleshooting

**Lỗi: "Cannot resolve symbol 'PDFMergerUtility'"**
- Chạy lại: `./gradlew build --refresh-dependencies`

**Lỗi: "No valid PDFs could be generated"**
- Kiểm tra xem các order ID có tồn tại không
- Kiểm tra template `order-confirmation-pdf.html` có đúng không
- Kiểm tra font trong thư mục `resources/fonts/`

**File PDF bị lỗi font**
- Đảm bảo file font `arial-unicode-ms.ttf` tồn tại trong `src/main/resources/fonts/`
