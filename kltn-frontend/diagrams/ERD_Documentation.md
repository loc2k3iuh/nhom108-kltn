# Tài liệu Mô tả Chi tiết ERD - Instrument Service

## Tổng quan

Sơ đồ ERD (Entity Relationship Diagram) này mô tả cấu trúc cơ sở dữ liệu MongoDB cho **Instrument Service** - một thành phần quan trọng trong hệ thống Quản lý Phòng thí nghiệm (Laboratory Management System). Dịch vụ này quản lý toàn bộ quy trình xét nghiệm thiết bị, thuốc thử và cấu hình cho các thiết bị phân tích huyết học.

### Kiến trúc Cơ sở dữ liệu
- **Loại CSDL**: MongoDB (Document-based NoSQL)
- **Số lượng Collections**: 11 collections chính
- **Phạm vi chức năng**: 3 module chính (Test Flow, Reagents Management, Configuration Management)

---

## 1. Core Entities (Thực thể Cốt lõi)

### 1.1 Instrument_Model (Mẫu Thiết bị)
**Mục đích**: Lưu trữ thông tin về các loại/model thiết bị phân tích huyết học.

| Trường | Kiểu dữ liệu | Mô tả | Ràng buộc |
|--------|--------------|-------|-----------|
| **Model_ID** | String (PK) | ID duy nhất của model thiết bị | Not null, Unique |
| Model_Name | String | Tên model thiết bị | Required |
| Manufacturer | String | Nhà sản xuất | Required |
| Model_Version | String | Phiên bản model | |
| Supported_Test_Types | Array[String] | Danh sách các loại xét nghiệm được hỗ trợ | |
| Technical_Specifications | Object | Thông số kỹ thuật chi tiết | JSON format |
| Default_Configuration | Object | Cấu hình mặc định | JSON format |
| Created_Date | DateTime | Ngày tạo record | Auto-generated |
| Updated_Date | DateTime | Ngày cập nhật cuối | Auto-updated |

**Ví dụ Document**:
```json
{
  "Model_ID": "MDL_001",
  "Model_Name": "Sysmex XN-1000",
  "Manufacturer": "Sysmex Corporation",
  "Model_Version": "v2.1",
  "Supported_Test_Types": ["CBC", "Diff", "Reticulocyte"],
  "Technical_Specifications": {
    "throughput": "60 samples/hour",
    "sample_volume": "175 μL",
    "parameters": 29
  },
  "Default_Configuration": {
    "auto_dilution": true,
    "qc_interval": "8 hours"
  }
}
```

### 1.2 Instrument (Thiết bị)
**Mục đích**: Quản lý thông tin và trạng thái của từng thiết bị cụ thể.

| Trường | Kiểu dữ liệu | Mô tả | Business Rules |
|--------|--------------|-------|----------------|
| **Instrument_ID** | String (PK) | ID duy nhất của thiết bị | Not null, Unique |
| **Model_ID** | String (FK) | Liên kết đến Instrument_Model | References Instrument_Model |
| Serial_Number | String | Số serial của thiết bị | Unique per manufacturer |
| Installation_Date | DateTime | Ngày lắp đặt thiết bị | |
| Current_Mode | Enum | Chế độ hiện tại | [Ready, Maintenance, Inactive] |
| Last_Mode_Change_TS | DateTime | Thời điểm thay đổi chế độ cuối | Auto-updated |
| Location | String | Vị trí đặt thiết bị | |
| Maintenance_Schedule | Object | Lịch bảo trì | JSON format |
| QC_Status | Enum | Trạng thái kiểm soát chất lượng | [Passed, Failed, Pending, NotRequired] |
| Is_Active | Boolean | Thiết bị có đang hoạt động | Default: true |
| Memory_Usage_Percent | Number | Phần trăm bộ nhớ đã sử dụng | 0-100 |
| Status | Enum | Trạng thái hoạt động | [Available, Busy, Error] |

**Business Logic**:
- Chuyển sang `Ready` yêu cầu QC_Status = "Passed"
- Chuyển sang `Maintenance`/`Inactive` yêu cầu lý do trong log
- Status tự động chuyển thành "Available" sau khi hoàn thành xét nghiệm

---

## 2. Test Results Management (Quản lý Kết quả Xét nghiệm)

### 2.1 Raw_Test_Result (Kết quả Xét nghiệm Thô)
**Mục đích**: Lưu trữ kết quả xét nghiệm thô làm backup trước khi publish.

| Trường | Kiểu dữ liệu | Mô tả | Validation |
|--------|--------------|-------|------------|
| **Result_ID** | String (PK) | ID duy nhất kết quả | Not null |
| **Instrument_ID** | String (FK) | Thiết bị thực hiện xét nghiệm | References Instrument |
| Test_Order_ID | String | ID lệnh xét nghiệm | Có thể auto-generated |
| Sample_Barcode | String | Mã vạch mẫu | Required |
| Raw_HL7_Message | String | Dữ liệu HL7 thô | Large text field |
| Analysis_Start_TS | DateTime | Thời điểm bắt đầu phân tích | |
| Analysis_Completion_TS | DateTime | Thời điểm hoàn thành | > Analysis_Start_TS |
| Result_Status | Enum | Trạng thái kết quả | [Completed, Processing, Failed, Pending] |
| Quality_Flags | Array[String] | Các cờ chất lượng | ["Normal", "Abnormal", "Critical"] |
| Publish_Status | Enum | Trạng thái publish | [Sent, Failed, Pending] |
| Is_Backup_Stored | Boolean | Đã backup trong Monitoring Service | Default: false |
| Memory_Size_KB | Number | Kích thước dữ liệu (KB) | For memory management |

### 2.2 HL7_Publish_Log (Nhật ký Publish HL7)
**Mục đích**: Theo dõi chi tiết việc publish kết quả đến các service khác.

| Trường | Kiểu dữ liệu | Mô tả | Notes |
|--------|--------------|-------|-------|
| **Publish_ID** | String (PK) | ID publish duy nhất | |
| **Result_ID** | String (FK) | Liên kết kết quả | References Raw_Test_Result |
| Target_Service | Enum | Service đích | [TestOrderService, MonitoringService] |
| Publish_Timestamp | DateTime | Thời điểm publish | |
| Publish_Status | Enum | Trạng thái publish | [Success, Failed, Retry] |
| Error_Message | String | Thông báo lỗi (nếu có) | Nullable |
| Retry_Count | Number | Số lần thử lại | Default: 0 |
| Last_Retry_TS | DateTime | Thời điểm thử lại cuối | Nullable |
| Response_Code | String | Mã phản hồi HTTP | |
| Processing_Time_MS | Number | Thời gian xử lý (ms) | Performance tracking |

### 2.3 Raw_Result_Deletion_Log (Nhật ký Xóa Kết quả)
**Mục đích**: Audit trail cho việc xóa kết quả thô (manual/auto).

| Trường | Kiểu dữ liệu | Mô tả | Compliance |
|--------|--------------|-------|------------|
| **Deletion_Log_ID** | String (PK) | ID log xóa | |
| **Result_ID** | String (FK) | Kết quả đã xóa | May be null after deletion |
| User_Performed | String | Người thực hiện (manual) | Nullable for auto |
| Deletion_Timestamp | DateTime | Thời điểm xóa | Required |
| Test_Order_ID | String | ID lệnh xét nghiệm đã xóa | For audit |
| Sample_Barcode | String | Mã vạch đã xóa | For audit |
| Deletion_Type | Enum | Loại xóa | [Manual, Auto] |
| Deletion_Reason | String | Lý do xóa | Required |
| Approved_By | String | Người phê duyệt | Required for manual |
| Memory_Freed_KB | Number | Bộ nhớ được giải phóng | |
| Backup_Verification_Status | Enum | Xác minh backup | [Verified, NotVerified, Failed] |

**Business Rule**: Chỉ được xóa khi Backup_Verification_Status = "Verified"

### 2.4 Auto_Test_Order_Creation (Tạo Tự động Lệnh Xét nghiệm)
**Mục đích**: Quản lý việc tự động tạo test order khi có barcode nhưng thiếu test order.

| Trường | Kiểu dữ liệu | Mô tả | Workflow |
|--------|--------------|-------|----------|
| **Creation_ID** | String (PK) | ID tạo tự động | |
| Sample_Barcode | String | Mã vạch mẫu | Trigger condition |
| Generated_Test_Order_ID | String | Test order được tạo | Auto-generated |
| **Instrument_ID** | String (FK) | Thiết bị tạo | References Instrument |
| Creation_Timestamp | DateTime | Thời điểm tạo | |
| User_Notified | Boolean | Đã thông báo user | Default: false |
| Patient_Info_Updated | Boolean | Đã cập nhật thông tin BN | Default: false |
| Status | Enum | Trạng thái | [Created, Pending_Update, Completed] |
| Notes | String | Ghi chú | |

---

## 3. Reagents Management (Quản lý Thuốc thử)

### 3.1 Reagent (Thuốc thử)
**Mục đích**: Quản lý thông tin thuốc thử và trạng thái sử dụng.

| Trường | Kiểu dữ liệu | Mô tả | Validation Rules |
|--------|--------------|-------|------------------|
| **Reagent_ID** | String (PK) | ID duy nhất thuốc thử | |
| Reagent_Name | String | Tên thuốc thử | Required |
| Reagent_Type | String | Loại thuốc thử | |
| Part_Number | String | Số part của nhà sản xuất | |
| Current_Quantity | Number | Số lượng hiện tại | >= 0 |
| Initial_Quantity | Number | Số lượng ban đầu | > 0 |
| Unit_Measure | String | Đơn vị đo | [mL, μL, tests, units] |
| Expiration_Date | Date | Ngày hết hạn | Must be future date |
| Lot_Number | String | Số lô | Required for traceability |
| Vendor_ID | String | ID nhà cung cấp | |
| Vendor_Name | String | Tên nhà cung cấp | Required |
| Storage_Conditions | String | Điều kiện bảo quản | |
| Is_Active | Boolean | Còn hoạt động | Default: true |
| In_Use_Status | Enum | Trạng thái sử dụng | [InUse, NotInUse, Expired, Depleted] |

**Business Rules**:
- Expiration_Date phải > ngày hiện tại khi install
- Current_Quantity tự động giảm khi sử dụng
- In_Use_Status tự động chuyển "Expired" khi hết hạn

### 3.2 Instrument_Reagent (Thiết bị - Thuốc thử)
**Mục đích**: Liên kết thiết bị với thuốc thử đang sử dụng.

| Trường | Kiểu dữ liệu | Mô tả | Business Logic |
|--------|--------------|-------|----------------|
| **Assignment_ID** | String (PK) | ID gán thuốc thử | |
| **Instrument_ID** | String (FK) | Thiết bị sử dụng | References Instrument |
| **Reagent_ID** | String (FK) | Thuốc thử được gán | References Reagent |
| Installation_Date | DateTime | Ngày cài đặt | |
| Position_Slot | String | Vị trí slot trên thiết bị | |
| Status | Enum | Trạng thái | [Installed, Removed, Expired, LowLevel] |
| Expected_Tests_Count | Number | Số test dự kiến | Based on reagent capacity |
| Actual_Tests_Count | Number | Số test thực tế | Auto-increment |
| Low_Level_Threshold | Number | Ngưỡng báo thiếu | |
| Sufficient_Level | Boolean | Đủ để chạy test | Auto-calculated |

**Key Business Rule**: 
- Sufficient_Level = false sẽ block việc start test
- Status tự động chuyển "LowLevel" khi < threshold

### 3.3 Reagent_Activity_Log (Nhật ký Hoạt động Thuốc thử)
**Mục đích**: Audit trail cho tất cả hoạt động liên quan thuốc thử.

| Trường | Kiểu dữ liệu | Mô tả | Audit Purpose |
|--------|--------------|-------|---------------|
| **Activity_ID** | String (PK) | ID hoạt động | |
| **Reagent_ID** | String (FK) | Thuốc thử | References Reagent |
| **Instrument_ID** | String (FK) | Thiết bị liên quan | References Instrument |
| Activity_Type | Enum | Loại hoạt động | [Install, Modify, Delete, Use, Replace] |
| User_Performed | String | Người thực hiện | Required for manual actions |
| Timestamp | DateTime | Thời điểm hoạt động | |
| Previous_Quantity | Number | Số lượng trước | For quantity changes |
| New_Quantity | Number | Số lượng sau | For quantity changes |
| Previous_Status | String | Trạng thái trước | For status changes |
| New_Status | String | Trạng thái sau | For status changes |
| Lot_Number | String | Số lô | For traceability |
| Supplier_Details | String | Chi tiết nhà cung cấp | For install/replace |
| Notes | String | Ghi chú thêm | |

---

## 4. Configuration Management (Quản lý Cấu hình)

### 4.1 Configuration_Profile (Profile Cấu hình)
**Mục đích**: Lưu trữ các profile cấu hình cho thiết bị.

| Trường | Kiểu dữ liệu | Mô tả | Configuration Types |
|--------|--------------|-------|-------------------|
| **Profile_ID** | String (PK) | ID profile duy nhất | |
| Profile_Name | String | Tên profile | Required |
| Profile_Type | Enum | Loại profile | [General, Specific] |
| Configuration_Data | Object | Dữ liệu cấu hình | JSON format |
| Is_Global | Boolean | Áp dụng toàn cục | true for General type |
| Target_Model_ID | String | Model đích (cho Specific) | Nullable for General |
| Target_Device_Type | String | Loại thiết bị đích | |
| Version | String | Phiên bản cấu hình | Semantic versioning |
| Firmware_Version | String | Phiên bản firmware tương thích | |
| Calibration_Settings | Object | Cài đặt hiệu chuẩn | JSON format |
| Created_By | String | Người tạo | Required |
| Is_Active | Boolean | Đang hoạt động | Default: true |

**Configuration Types**:
- **General**: Áp dụng cho tất cả thiết bị (Is_Global = true)
- **Specific**: Áp dụng cho model/type cụ thể (Target_Model_ID required)

### 4.2 Configuration_Sync_Log (Nhật ký Đồng bộ Cấu hình)
**Mục đích**: Theo dõi việc đồng bộ cấu hình cho từng thiết bị.

| Trường | Kiểu dữ liệu | Mô tả | Sync Process |
|--------|--------------|-------|--------------|
| **Sync_Log_ID** | String (PK) | ID log đồng bộ | |
| **Instrument_ID** | String (FK) | Thiết bị được sync | References Instrument |
| **Profile_ID** | String (FK) | Profile được áp dụng | References Configuration_Profile |
| User_Performed | String | Người thực hiện sync | Required |
| Sync_Timestamp | DateTime | Thời điểm đồng bộ | |
| Sync_Type | Enum | Loại đồng bộ | [General, Specific, Both] |
| Sync_Status | Enum | Trạng thái đồng bộ | [Success, Failed, Partial] |
| Error_Details | String | Chi tiết lỗi (nếu có) | Nullable |
| Configuration_Hash | String | Hash của cấu hình | For integrity check |
| Rollback_Data | Object | Dữ liệu rollback | JSON format |
| Device_Type_Validated | Boolean | Đã validate device type | Required check |
| General_Config_Applied | Boolean | Đã áp dụng General config | |
| Specific_Config_Applied | Boolean | Đã áp dụng Specific config | |
| Processing_Time_MS | Number | Thời gian xử lý (ms) | Performance tracking |

**Sync Validation Process**:
1. Validate Device_Type_Validated = true
2. Apply General configurations if available
3. Apply Specific configurations for device model
4. Set appropriate status flags
5. Log any failures with detailed error information

---

## 5. Relationships và Business Rules

### 5.1 Relationships Matrix

| Parent Entity | Child Entity | Relationship Type | Description |
|---------------|--------------|-------------------|-------------|
| Instrument_Model | Instrument | One-to-Many | Một model có nhiều thiết bị |
| Instrument_Model | Configuration_Profile | One-to-Many | Model có thể có nhiều specific config |
| Instrument | Instrument_Mode_Change_Log | One-to-Many | Thiết bị có nhiều log thay đổi mode |
| Instrument | Raw_Test_Result | One-to-Many | Thiết bị tạo nhiều kết quả |
| Instrument | Configuration_Sync_Log | One-to-Many | Thiết bị có nhiều log sync |
| Instrument | Instrument_Reagent | One-to-Many | Thiết bị sử dụng nhiều thuốc thử |
| Instrument | Auto_Test_Order_Creation | One-to-Many | Thiết bị tạo nhiều auto order |
| Raw_Test_Result | HL7_Publish_Log | One-to-Many | Kết quả có nhiều log publish |
| Raw_Test_Result | Raw_Result_Deletion_Log | One-to-Zero-or-One | Kết quả có thể có log xóa |
| Reagent | Instrument_Reagent | One-to-Many | Thuốc thử dùng cho nhiều thiết bị |
| Reagent | Reagent_Activity_Log | One-to-Many | Thuốc thử có nhiều log hoạt động |
| Instrument_Reagent | Reagent_Activity_Log | One-to-Many | Assignment tạo nhiều log |
| Configuration_Profile | Configuration_Sync_Log | One-to-Many | Profile được sync nhiều lần |

### 5.2 Critical Business Rules

#### 5.2.1 Instrument Mode Management
```
IF New_Mode = "Ready" THEN
    QC_Status MUST = "Passed"
    AND QC_Confirmation MUST = true
    
IF New_Mode IN ["Maintenance", "Inactive"] THEN
    Reason_Provided IS REQUIRED
    AND User_Performed IS REQUIRED
```

#### 5.2.2 Test Execution Rules
```
BEFORE starting test:
    Current_Mode MUST = "Ready"
    AND Status MUST = "Available"
    AND ALL assigned reagents WHERE Sufficient_Level = true
    
IF Test_Order_ID IS NULL AND Sample_Barcode IS VALID THEN
    CREATE Auto_Test_Order_Creation record
    GENERATE new Test_Order_ID
    SET User_Notified = false
```

#### 5.2.3 Memory Management Rules
```
IF Memory_Usage_Percent > 80 THEN
    TRIGGER auto deletion process
    WHERE Is_Backup_Stored = true
    AND Backup_Verification_Status = "Verified"
    
DELETE oldest results first
LOG all deletions in Raw_Result_Deletion_Log
```

#### 5.2.4 Reagent Management Rules
```
BEFORE reagent installation:
    Expiration_Date MUST > CURRENT_DATE
    Current_Quantity MUST > 0
    
UPDATE Sufficient_Level = (Current_Quantity > Low_Level_Threshold)

IF Sufficient_Level = false THEN
    BLOCK new test execution
    NOTIFY user for reagent replacement
```

#### 5.2.5 Configuration Sync Rules
```
BEFORE sync:
    VALIDATE Instrument exists
    VALIDATE Device_Type matches Profile requirements
    
FOR General configs: Apply to ALL instruments
FOR Specific configs: Apply ONLY to matching Model_ID

IF sync FAILS THEN
    USE Rollback_Data to restore previous state
    LOG detailed Error_Details
```

---

## 6. Indexing Strategy (MongoDB)

### 6.1 Primary Indexes
```javascript
// Instrument collection
db.instrument.createIndex({ "Instrument_ID": 1 }, { unique: true })
db.instrument.createIndex({ "Model_ID": 1, "Serial_Number": 1 })
db.instrument.createIndex({ "Current_Mode": 1, "Status": 1 })

// Raw_Test_Result collection  
db.raw_test_result.createIndex({ "Result_ID": 1 }, { unique: true })
db.raw_test_result.createIndex({ "Instrument_ID": 1, "Analysis_Completion_TS": -1 })
db.raw_test_result.createIndex({ "Test_Order_ID": 1, "Sample_Barcode": 1 })
db.raw_test_result.createIndex({ "Publish_Status": 1, "Is_Backup_Stored": 1 })

// Reagent collections
db.reagent.createIndex({ "Reagent_ID": 1 }, { unique: true })
db.reagent.createIndex({ "Expiration_Date": 1, "In_Use_Status": 1 })
db.instrument_reagent.createIndex({ "Instrument_ID": 1, "Status": 1 })
db.instrument_reagent.createIndex({ "Sufficient_Level": 1 })
```

### 6.2 Performance Indexes
```javascript
// For audit trails and logging
db.instrument_mode_change_log.createIndex({ "Instrument_ID": 1, "Timestamp": -1 })
db.reagent_activity_log.createIndex({ "Reagent_ID": 1, "Timestamp": -1 })
db.configuration_sync_log.createIndex({ "Instrument_ID": 1, "Sync_Timestamp": -1 })

// For memory management queries
db.raw_test_result.createIndex({ 
  "Analysis_Completion_TS": 1, 
  "Is_Backup_Stored": 1,
  "Memory_Size_KB": -1 
})
```

---

## 7. Data Validation và Constraints

### 7.1 Field Validation Rules
```javascript
// Instrument validation
{
  "Current_Mode": { "$in": ["Ready", "Maintenance", "Inactive"] },
  "QC_Status": { "$in": ["Passed", "Failed", "Pending", "NotRequired"] },
  "Memory_Usage_Percent": { "$gte": 0, "$lte": 100 },
  "Status": { "$in": ["Available", "Busy", "Error"] }
}

// Reagent validation  
{
  "Current_Quantity": { "$gte": 0 },
  "Initial_Quantity": { "$gt": 0 },
  "Expiration_Date": { "$gt": new Date() }, // For new installations
  "In_Use_Status": { "$in": ["InUse", "NotInUse", "Expired", "Depleted"] }
}

// Configuration validation
{
  "Profile_Type": { "$in": ["General", "Specific"] },
  "Sync_Status": { "$in": ["Success", "Failed", "Partial"] },
  "Sync_Type": { "$in": ["General", "Specific", "Both"] }
}
```

### 7.2 Business Logic Validation
```javascript
// Mode change validation
function validateModeChange(instrument, newMode, qcStatus, reason) {
  if (newMode === "Ready" && qcStatus !== "Passed") {
    throw new Error("QC must pass before setting to Ready mode");
  }
  if (["Maintenance", "Inactive"].includes(newMode) && !reason) {
    throw new Error("Reason required for Maintenance/Inactive mode");
  }
}

// Reagent sufficiency check
function checkReagentSufficiency(instrumentId) {
  const insufficientReagents = db.instrument_reagent.find({
    "Instrument_ID": instrumentId,
    "Status": "Installed", 
    "Sufficient_Level": false
  });
  return insufficientReagents.length === 0;
}
```

---

## 8. Performance Considerations

### 8.1 Collection Size Estimates
| Collection | Expected Growth | Retention Policy |
|------------|-----------------|------------------|
| Raw_Test_Result | ~1000 records/day | Auto-delete after backup (7-30 days) |
| HL7_Publish_Log | ~2000 records/day | Keep 90 days |
| Instrument_Mode_Change_Log | ~50 records/day | Keep permanently |
| Reagent_Activity_Log | ~100 records/day | Keep permanently |
| Configuration_Sync_Log | ~20 records/day | Keep permanently |

### 8.2 Query Optimization Patterns
```javascript
// Efficient queries for common operations
// 1. Get available instruments with sufficient reagents
db.instrument.aggregate([
  { $match: { "Current_Mode": "Ready", "Status": "Available" } },
  { $lookup: {
    from: "instrument_reagent",
    localField: "Instrument_ID", 
    foreignField: "Instrument_ID",
    as: "reagents"
  }},
  { $match: { "reagents.Sufficient_Level": { $ne: false } } }
]);

// 2. Get test results pending deletion (memory management)
db.raw_test_result.find({
  "Is_Backup_Stored": true,
  "Analysis_Completion_TS": { $lt: new Date(Date.now() - 7*24*60*60*1000) }
}).sort({ "Analysis_Completion_TS": 1 }).limit(100);

// 3. Get reagents expiring soon
db.reagent.find({
  "Expiration_Date": { 
    $gte: new Date(),
    $lte: new Date(Date.now() + 7*24*60*60*1000)
  },
  "Is_Active": true
}).sort({ "Expiration_Date": 1 });
```

---

## 9. Integration Points

### 9.1 External Service Dependencies
- **Test Order Service**: Receive test orders, send results
- **Monitoring Service**: Send backup data, sync requests  
- **User Service**: User authentication and authorization
- **Notification Service**: Alerts and notifications

### 9.2 Data Flow Patterns
```
1. Test Execution Flow:
   Instrument → Raw_Test_Result → HL7_Publish_Log → External Services

2. Reagent Management Flow:  
   User Action → Reagent → Instrument_Reagent → Reagent_Activity_Log

3. Configuration Sync Flow:
   User Request → Configuration_Profile → Configuration_Sync_Log → Instrument Update

4. Memory Management Flow:
   Background Job → Raw_Test_Result (check) → Raw_Result_Deletion_Log → Delete
```

---

## 10. Monitoring và Alerting

### 10.1 Key Metrics to Monitor
- Instrument availability and mode distribution
- Memory usage trends and auto-deletion frequency  
- Reagent levels and expiration tracking
- Configuration sync success rates
- HL7 publish success/failure rates
- Test throughput per instrument

### 10.2 Alert Conditions
```javascript
// Critical alerts
- Memory_Usage_Percent > 90%
- Reagent Sufficient_Level = false for active instruments  
- Configuration sync failures
- HL7 publish failures > 5% in 1 hour
- QC_Status = "Failed" for instruments in Ready mode

// Warning alerts  
- Reagents expiring within 7 days
- Memory_Usage_Percent > 80%
- Instruments in Maintenance mode > 24 hours
- Backup verification failures
```

---

**Tài liệu này cung cấp cái nhìn toàn diện về cấu trúc ERD cho Instrument Service, đảm bảo việc implementation MongoDB hiệu quả và tuân thủ các yêu cầu nghiệp vụ phức tạp của hệ thống quản lý phòng thí nghiệm.**