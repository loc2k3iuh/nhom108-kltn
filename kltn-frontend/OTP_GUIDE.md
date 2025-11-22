# Hướng dẫn sử dụng trang OTP Verification

## Tổng quan
Trang OTP Verification đã được tạo thành công với các tính năng sau:

### Các component đã tạo:

1. **OtpInput** (`src/components/form/input/OtpInput.tsx`)
   - Component input cho 6 chữ số OTP
   - Tự động focus chuyển giữa các ô
   - Hỗ trợ paste mã OTP
   - Xử lý phím Backspace và Arrow keys
   - Validation và error states

2. **OtpForm** (`src/components/auth/OtpForm.tsx`)
   - Form chính để nhập và xác thực OTP
   - Hiển thị email đã được mask (ẩn một phần)
   - Nút gửi lại OTP với countdown timer
   - Loading states và error handling
   - UI tương tự với form đăng nhập hiện có

3. **OtpVerification** (`src/pages/AuthPages/OtpVerification.tsx`)
   - Trang chính sử dụng AuthLayout
   - Xử lý logic verify và resend OTP
   - Tích hợp với routing system

### Cách sử dụng:

1. **Truy cập trang OTP:**
   ```
   http://localhost:5173/otp-verification
   ```

2. **Truyền email qua URL parameters:**
   ```
   http://localhost:5173/otp-verification?email=user@example.com
   ```

3. **Hoặc lưu email trong localStorage:**
   ```javascript
   localStorage.setItem('otp-email', 'user@example.com');
   ```

### Tính năng chính:

✅ **Nhập OTP 6 số**
- Tự động focus chuyển đổi giữa các ô
- Paste mã OTP từ clipboard
- Validation real-time

✅ **Gửi lại OTP**
- Countdown timer 60 giây
- Disable button khi đang gửi hoặc trong thời gian chờ

✅ **Responsive Design**
- Tương thích với dark/light mode
- Mobile-friendly UI

✅ **Error Handling**
- Hiển thị lỗi validation
- Xử lý lỗi API

### Tích hợp API:

Trong file `OtpVerification.tsx`, bạn cần thay thế các comment TODO bằng API calls thực tế:

```typescript
// Verify OTP
const response = await fetch("/api/auth/verify-otp", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email,
    otp,
  }),
});

// Resend OTP
const response = await fetch("/api/auth/resend-otp", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email,
  }),
});
```

### Customization:

1. **Thay đổi số lượng chữ số OTP:**
   ```tsx
   <OtpInput length={4} /> // Cho OTP 4 số
   ```

2. **Thay đổi placeholder:**
   ```tsx
   <OtpInput placeholder="●" />
   ```

3. **Thêm validation tùy chỉnh:**
   ```tsx
   <OtpInput 
     error={hasError}
     onChange={(otp) => setOtp(otp)}
     onComplete={(otp) => handleVerify(otp)}
   />
   ```

### Routing:
Route đã được thêm vào `src/App.tsx`:
```tsx
<Route path="/otp-verification" element={<OtpVerification />} />
```

Trang OTP Verification đã sẵn sàng sử dụng! 🎉