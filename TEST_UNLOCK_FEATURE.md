# Hướng dẫn Test Tính năng Mở khóa Khoá học sau 3 ngày

## Tổng quan tính năng

Tính năng này sẽ mở khóa toàn bộ nội dung khóa học sau 3 ngày kể từ ngày mua. Trước đó, người học chỉ có thể xem các episode preview.

## Các thay đổi đã thực hiện

### Backend Changes

1. **CourseServiceImpl.java**
   - Thêm method `isCourseFullyUnlocked()` để kiểm tra xem khóa học đã qua 3 ngày chưa
   - Logic: `daysSincePurchase >= 3`

2. **CourseController.java**
   - Cập nhật endpoint `/courses/{id}` để trả về thông tin `isFullyUnlocked`
   - Cập nhật endpoint `/courses/details/{id}` để tính toán quyền truy cập từng episode

3. **CourseListResponseDTO.java**
   - Thêm field `isFullyUnlocked`

4. **CourseDetailResponseDTO.java**
   - Thêm fields: `hasAccess`, `isPurchased`, `isFullyUnlocked`

### Frontend Changes

1. **CourseVideo.jsx**
   - Thêm state `isFullyUnlocked`
   - Cập nhật logic kiểm tra quyền truy cập episode
   - Hiển thị thông báo khác nhau cho từng trạng thái

2. **Detail.jsx**
   - Thêm state `isFullyUnlocked`
   - Cập nhật hiển thị nút "Continue Learning"
   - Thêm thông báo về thời gian mở khóa

## Cách test

### Test Case 1: Khoá học chưa mua
```
1. Truy cập course detail mà chưa mua
2. Chỉ hiển thị episodes có isPreview = true
3. Hiển thị nút "Enroll Now"
```

### Test Case 2: Khoá học vừa mua (dưới 3 ngày)
```
1. Mua một khoá học
2. Truy cập course detail/video
3. Hiển thị thông báo "Chờ mở khóa sau 3 ngày"
4. Chỉ có thể xem preview episodes
```

### Test Case 3: Khoá học đã mua trên 3 ngày
```
1. Sửa ngày mua trong database (dateOrder) về trước 3 ngày
2. Truy cập course detail/video
3. Hiển thị "Continue Learning" / "Toàn bộ khóa học"
4. Có thể xem tất cả episodes
```

## Manual Testing với Database

### Bước 1: Mua khoá học
```sql
-- Kiểm tra order hiện tại
SELECT * FROM orders WHERE id_user = [USER_ID] AND id_course = [COURSE_ID];
```

### Bước 2: Sửa ngày mua để test
```sql
-- Sửa ngày mua về 4 ngày trước
UPDATE orders 
SET date_order = DATE_SUB(CURDATE(), INTERVAL 4 DAY)
WHERE id_user = [USER_ID] AND id_course = [COURSE_ID];
```

### Bước 3: Test API endpoints
```bash
# Test course info
curl "http://localhost:8080/courses/1?userId=1"

# Test course details
curl "http://localhost:8080/courses/details/1?userId=1"
```

## Expected API Response

### Course Info Response
```json
{
  "code": 200,
  "message": "Course found",
  "result": {
    "id": 1,
    "name": "Test Course",
    "purchased": true,
    "purchaseDate": "2024-01-01",
    "isFullyUnlocked": true  // true nếu > 3 ngày
  }
}
```

### Course Details Response
```json
{
  "code": 200,
  "message": "Fetched course details successfully.",
  "result": [
    {
      "id": 1,
      "episodeNumber": 1,
      "isPreview": true,
      "hasAccess": true,    // luôn true cho preview
      "isPurchased": true,
      "isFullyUnlocked": true
    },
    {
      "id": 2,
      "episodeNumber": 2,
      "isPreview": false,
      "hasAccess": true,    // true chỉ khi fully unlocked
      "isPurchased": true,
      "isFullyUnlocked": true
    }
  ]
}
```

## Frontend UI States

### State 1: Chưa mua
- Nút: "Enroll Now"
- Episodes: Chỉ preview có thể xem
- Icon: 🔒 (locked)

### State 2: Đã mua, chưa đủ 3 ngày
- Nút: "Watch Available Content"
- Thông báo: "Full course unlocks 3 days after purchase"
- Episodes: Chỉ preview + status "Mở khóa sau 3 ngày"
- Icon: 🔓 (partial unlock)

### State 3: Đã mua, đủ 3 ngày
- Nút: "Continue Learning"
- Status: "Toàn bộ khóa học"
- Episodes: Tất cả có thể xem
- Icon: ✅ (fully unlocked)

## Debugging

### Backend Logs
```java
// CourseServiceImpl.java
System.out.println("Purchase date: " + purchaseDate);
System.out.println("Current date: " + currentDate);
System.out.println("Days since purchase: " + daysSincePurchase);
System.out.println("Is fully unlocked: " + (daysSincePurchase >= 3));
```

### Frontend Console
```javascript
// CourseVideo.jsx
console.log('Purchase status:', isPurchased, 'Fully unlocked:', isFullyUnlocked);
```

## Reset Test Data
```sql
-- Reset ngày mua về hiện tại
UPDATE orders 
SET date_order = CURDATE()
WHERE id_user = [USER_ID] AND id_course = [COURSE_ID];
``` 