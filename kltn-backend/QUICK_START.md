# 🚀 Quick Start - Statistics API

## ✅ Build Status: SUCCESS

## 📋 Files Created Summary

| Type | File | Location |
|------|------|----------|
| DTO | DashboardStatsResponse | dtos/responses/ |
| DTO | RevenueStatsResponse | dtos/responses/ |
| DTO | StatsPeriodRequest | dtos/requests/ |
| Repository | OrderRepository (updated) | repositories/ |
| Repository | UserRepository (updated) | repositories/ |
| Service | IStatisticsService | services/interfaces/ |
| Service | StatisticsServiceImpl | services/impls/ |
| Controller | StatisticsController | controllers/ |

## 🔗 API Quick Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/statistics/dashboard` | GET | Thống kê tổng quan |
| `/api/v1/statistics/revenue` | GET | Doanh thu chi tiết |
| `/api/v1/statistics/today` | GET | Thống kê hôm nay |
| `/api/v1/statistics/this-month` | GET | Thống kê tháng này |
| `/api/v1/statistics/this-year` | GET | Thống kê năm này |

## 💡 Quick Test Commands

```bash
# 1. Run the application
cd C:\Users\ADMIN\Downloads\nhom108-kltn\kltn-backend
gradlew bootRun

# 2. Test today's stats
curl http://localhost:8080/api/v1/statistics/today

# 3. Test month stats
curl "http://localhost:8080/api/v1/statistics/dashboard?year=2025&month=11"

# 4. Test revenue by day
curl "http://localhost:8080/api/v1/statistics/revenue?period=DAY"
```

## 📊 Response Fields

**DashboardStatsResponse:**
- `totalRevenue` - Tổng doanh thu
- `totalProfit` - Lợi nhuận (revenue - discount - shipping)
- `totalDiscount` - Tổng chiết khấu
- `totalShippingCost` - Tổng phí ship
- `totalOrders` - Tổng đơn hàng
- `pendingOrders` - Đơn mới (PENDING)
- `processingOrders` - Đang giao (PROCESSING)
- `completedOrders` - Hoàn thành (COMPLETED)
- `cancelledOrders` - Đã hủy (CANCELLED)
- `totalCustomers` - Tổng khách hàng
- `newCustomers` - Khách hàng mới
- `newCustomerRate` - % khách hàng mới

## 🎯 Common Query Parameters

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| startDate | String | 2025-11-01 | Ngày bắt đầu |
| endDate | String | 2025-11-05 | Ngày kết thúc |
| year | Integer | 2025 | Năm |
| month | Integer | 11 | Tháng (1-12) |
| period | String | DAY/MONTH/YEAR | Chu kỳ |

## ⚡ Example Requests

### Get November 2025 stats
```
GET /api/v1/statistics/dashboard?year=2025&month=11
```

### Get custom date range
```
GET /api/v1/statistics/dashboard?startDate=2025-11-01&endDate=2025-11-05
```

### Get daily revenue for last 30 days
```
GET /api/v1/statistics/revenue?period=DAY
```

### Get monthly revenue for 2025
```
GET /api/v1/statistics/revenue?startDate=2025-01-01&endDate=2025-12-31&period=MONTH
```

## 📚 Documentation Files

1. **STATISTICS_API_DOCUMENTATION.md** - Chi tiết đầy đủ
2. **STATISTICS_IMPLEMENTATION_SUMMARY.md** - Tóm tắt triển khai
3. **BUILD_SUCCESS_GUIDE.md** - Hướng dẫn test và sử dụng
4. **QUICK_START.md** (this file) - Reference nhanh

## 🔍 Debug Checklist

- [ ] Application running? → `gradlew bootRun`
- [ ] Database connected? → Check logs
- [ ] Has COMPLETED orders? → Check database
- [ ] Date format correct? → Use yyyy-MM-dd
- [ ] Swagger working? → http://localhost:8080/swagger-ui.html

## 📞 Need Help?

1. Check logs: `build/logs/` or console
2. View Swagger UI for interactive testing
3. Read STATISTICS_API_DOCUMENTATION.md
4. Verify database has test data

---

**Last Updated:** 2025-11-05
**Status:** ✅ Production Ready
**Build:** ✅ Successful
