# Student Management Feature - With Chat Integration

## Overview
Trang quản lý học viên đã được nâng cấp với tính năng chat trực tiếp giữa seller và student, sử dụng dữ liệu thật từ database.

## Backend Implementation

### 1. New DTO - StudentEnrollmentResponseDTO
**File:** `back_end/src/main/java/com/example/back_end/dto/response/StudentEnrollmentResponseDTO.java`

Contains student enrollment information:
- `id` - Order ID
- `userId` - Student's user ID  
- `studentName` - Student's full name
- `studentEmail` - Student's email
- `studentAvatar` - Student's profile image
- `studentPhone` - Student's phone number
- `studentGender` - Student's gender
- `courseId` - Course ID
- `courseName` - Course name
- `coursePrice` - Course price
- `enrollmentDate` - Date of enrollment
- `enrollmentStatus` - "active", "completed", or "paused"
- `daysSinceEnrollment` - Number of days since enrollment
- `isFullyUnlocked` - Boolean (true if 3+ days have passed)

### 2. New Service Method - SellerService.getSellerStudents()
**File:** `back_end/src/main/java/com/example/back_end/service/SellerService.java`

```java
public List<StudentEnrollmentResponseDTO> getSellerStudents(Integer sellerId)
```

Features:
- Fetches all orders for courses owned by the seller
- Calculates days since enrollment using `ChronoUnit.DAYS.between()`
- Determines enrollment status based on time elapsed
- Maps user and course data to response DTO

### 3. New Controller Endpoint
**File:** `back_end/src/main/java/com/example/back_end/controller/SellerController.java`

```
GET /seller/{sellerId}/students
```

- **Authorization:** `SELLER` or `ADMIN` roles only
- **Response:** `ApiResponse<List<StudentEnrollmentResponseDTO>>`

## Frontend Implementation

### 1. New API Service Method
**File:** `front_end/src/API/SellerService.jsx`

```javascript
getSellerStudents: async (sellerId) => {
  const response = await axiosClient.get(`/seller/${sellerId}/students`);
  return response.data;
}
```

### 2. New Page - SellerStudents.jsx
**File:** `front_end/src/Pages/SellerStudents.jsx`

Features:
- **Student List Table** with filtering and search
- **Avatar Display** using consistent avatar utils
- **Enrollment Status** tracking (active, completed, paused)
- **Unlock Progress** showing days until full course unlock
- **Contact Actions** - email student directly
- **Export Functionality** - download CSV of student data
- **Responsive Design** with dark mode support

### 3. Updated SellerDashboard
**File:** `front_end/src/Pages/SellerDashboard.jsx`

Added:
- New "Quản lý học viên" action card with orange styling
- Navigation to `/seller/students`
- 4-column action card layout

### 4. Updated SellerLayout Navigation
**File:** `front_end/src/component/SellerLayout.jsx`

Added:
- "Học viên" menu item with `FiUsers` icon
- Navigation to `/seller/students`

### 5. New Route
**File:** `front_end/src/routes/AppRoutes.jsx`

```javascript
<Route
  path="/seller/students"
  element={
    <ProtectedRoute allowedRoles={["SELLER", "ADMIN"]}>
      <SellerStudents />
    </ProtectedRoute>
  }
/>
```

## Usage

### For Sellers:
1. Navigate to Seller Dashboard
2. Click "Quản lý học viên" action card or use sidebar navigation
3. View enrolled students with filtering options
4. Contact students directly via email
5. Export student data as needed

### For Admins:
- Full access to all seller student management features
- Can view any seller's student list
- Same interface and functionality 

## Backend API - Real Data Source

### Endpoint: `/seller/{sellerId}/students`
- **Method**: GET
- **Authorization**: SELLER hoặc ADMIN roles
- **Data Source**: 
  - `orders` table - chứa thông tin đăng ký khóa học
  - `users` table - thông tin học viên  
  - `course` table - thông tin khóa học
- **Logic**: Lấy tất cả orders của các courses thuộc seller, join với user và course data

### Real Sample Data trong database:
```sql
-- Students (users with USER role)
User ID 6: "Nguyễn Văn A" - student1@test.com
User ID 7: "Trần Thị B" - student2@test.com
User ID 4: "Quốc Thái" - quoc2612003@gmail.com (ADMIN role, also student)

-- Orders (học viên đã đăng ký)
User 6 đăng ký: Course 16, 17, 20, 18
User 7 đăng ký: Course 18, 19, 16  
User 4 đăng ký: Course 1, 2, 3, 4

-- Sellers 
User ID 1: "Tâm Lê" (ADMIN)
User ID 2: "Nguyen" (SELLER)
User ID 5: "Quang Minh Nguyễn" (SELLER)
```

## Chat Feature Integration

### 1. Firebase Realtime Database
- **Chat Platform**: Firebase Realtime Database
- **Conversation Structure**:
  ```javascript
  conversations/{conversationId}: {
    id: "conv_1_6", // format: conv_{sellerId}_{studentId}
    user1_id: 1,    // seller ID
    user2_id: 6,    // student ID
    created_at: timestamp,
    last_message: null,
    last_updated: timestamp
  }
  ```

### 2. Chat Functionality
- **Tự động tìm conversation hiện có**: Sử dụng `findConversationByUsers()`
- **Tự động tạo conversation mới**: Nếu chưa có, sử dụng Firebase `push()` để tạo ID tự động
- **Conversation ID format**: Firebase auto-generated (vd: `-NpQqVKj3rN8oEz7Hg6J`)
- **Navigation**: Chuyển đến `/chat/{firebaseGeneratedId}`

### 3. UI Chat Integration
- **Chat Button**: Màu tím với icon `FiMessageCircle`
- **Loading State**: SweetAlert2 loading khi tìm/tạo conversation
- **Error Handling**: Thông báo lỗi chi tiết cho từng bước

### 4. Firebase Conversation Structure
```javascript
conversations/{firebaseAutoId}: {
  user1_id: Number(sellerId),     // ID của seller (current user)
  user2_id: Number(studentId),    // ID của student
  created_at: timestamp           // Thời gian tạo
}
```

## Testing Instructions

### 1. Kiểm tra dữ liệu thật từ database

#### Backend Test:
```bash
# Start backend
cd back_end
./mvnw spring-boot:run

# Test API (requires authentication)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     "http://localhost:8080/api/seller/5/students"
```

#### Expected Response (Real Data):
```json
{
  "code": 200,
  "message": "Success",
  "result": [
    {
      "id": 5,
      "userId": 6,
      "studentName": "Nguyễn Văn A",
      "studentEmail": "student1@test.com",
      "studentPhone": "0912345678",
      "studentGender": "Male",
      "courseId": 16,
      "courseName": "IELTS Speaking Mastery 2024",
      "coursePrice": 159.99,
      "enrollmentDate": "2024-12-01",
      "enrollmentStatus": "active",
      "daysSinceEnrollment": 20, 
      "isFullyUnlocked": true
    }
    // ... more students
  ]
}
```

### 2. Frontend Testing

#### Login as Seller:
```
Email: quangminhnguyn26@gmail.com
Password: (check with admin)
Role: SELLER
User ID: 5
```

#### Expected UI Behavior:
1. **Data Loading**: Students được load từ API thật
2. **Student List**: Hiển thị học viên đã đăng ký thực tế
3. **Chat Button**: Màu tím, có tooltip "Chat với học viên"
4. **Click Chat**: 
   - Loading popup xuất hiện
   - Tìm conversation hiện có bằng `findConversationByUsers()`
   - Nếu có: Chuyển đến `/chat/{existingId}`
   - Nếu chưa có: Tạo conversation mới với Firebase auto-generated ID
   - Chuyển đến `/chat/{newFirebaseId}`

### 3. Chat Testing

#### Firebase Console Check:
```
https://console.firebase.google.com/
Project: your-project
Database: Realtime Database

Kiểm tra path: /conversations/{firebaseAutoId}
VD: /conversations/-NpQqVKj3rN8oEz7Hg6J
```

#### Chat Flow:
1. Seller click "Chat với học viên" 
2. System tìm conversation hiện có
3. Nếu có: Navigate đến chat page với existing ID
4. Nếu chưa có: Tạo conversation mới với Firebase push()
5. Navigate to chat page với auto-generated ID
6. Có thể gửi tin nhắn qua lại
7. Messages lưu trong Firebase `/messages`

## Key Features

### ✅ Real Database Integration
- Students data từ `orders` table thật
- Không còn mock/fallback data
- Error handling rõ ràng nếu API fail

### ✅ Chat Integration  
- Firebase Realtime Database
- Auto conversation creation
- Seamless navigation
- Error handling với SweetAlert2

### ✅ UI/UX Improvements
- 3 action buttons: Email, Chat, View Course
- Chat button có màu tím riêng biệt
- Loading states và error messages
- Responsive design

### ✅ Security
- JWT authentication required
- Role-based access (SELLER/ADMIN only)
- Conversation ID predictable nhưng access được control

## Error Scenarios

### No Authentication:
```json
{
  "code": 401,
  "message": "Không có quyền truy cập. Vui lòng đăng nhập lại."
}
```

### No Students Found:
```json
{
  "code": 200,
  "message": "Success", 
  "result": []
}
```

### Chat Creation Failed:
- SweetAlert error popup
- User có thể retry
- Console logging để debug

## Mobile Support
- Responsive design
- Touch-friendly buttons
- Chat interface tối ưu mobile
- Sidebar overlay trên mobile

## Future Enhancements
- [ ] Real-time notifications cho chat mới
- [ ] Chat history search
- [ ] File sharing trong chat
- [ ] Voice messages
- [ ] Student online status
- [ ] Chat analytics cho seller 