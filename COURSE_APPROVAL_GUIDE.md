# Hướng dẫn sử dụng chức năng phê duyệt khóa học

## Tổng quan
Chức năng phê duyệt khóa học cho phép admin quản lý và phê duyệt các khóa học được tạo bởi seller trước khi xuất bản cho học viên.

## Kiến trúc hệ thống

### Backend
- **AdminController**: Xử lý các API endpoints cho admin
- **CourseServiceImpl**: Chứa logic nghiệp vụ phê duyệt
- **Course Entity**: Có trường `status` (Boolean) để quản lý trạng thái

### Frontend
- **AdminService**: Service API để gọi backend
- **AdminCourseApproval**: Component giao diện phê duyệt

## API Endpoints

### 1. Lấy tất cả khóa học cho admin
```http
GET /admin/courses
Authorization: Bearer token (ADMIN role required)
```

### 2. Lấy khóa học chờ phê duyệt
```http
GET /admin/courses/pending
Authorization: Bearer token (ADMIN role required)
```

### 3. Phê duyệt khóa học
```http
PUT /admin/courses/{courseId}/approve
Authorization: Bearer token (ADMIN role required)
```

### 4. Từ chối khóa học
```http
PUT /admin/courses/{courseId}/reject
Authorization: Bearer token (ADMIN role required)

Body:
{
  "reason": "Lý do từ chối"
}
```

### 5. Thống kê khóa học
```http
GET /admin/courses/statistics
Authorization: Bearer token (ADMIN role required)
```

## Cách sử dụng

### Đăng nhập với quyền Admin
1. Sử dụng tài khoản admin có trong database
2. Email: `tamle7723@gmail.com` hoặc `quoc2612003@gmail.com`
3. Mật khẩu: Theo database hiện có

### Truy cập trang phê duyệt
1. Đi đến `/admin/course-approval`
2. Trang sẽ hiển thị danh sách tất cả khóa học
3. Có thể filter theo:
   - Trạng thái: pending, approved, rejected
   - Loại: create, update, delete
   - Tìm kiếm theo tên khóa học, tên seller

### Phê duyệt khóa học
1. Nhấn nút "Phê duyệt" trên khóa học cần phê duyệt
2. Xác nhận trong modal popup
3. Khóa học sẽ được chuyển từ `status = false` sang `status = true`

### Từ chối khóa học
1. Nhấn nút "Từ chối" trên khóa học
2. Nhập lý do từ chối trong modal
3. Khóa học sẽ bị xóa khỏi hệ thống

## Dữ liệu test

### Khóa học chờ phê duyệt (status = false)
- ID: 21 - "IELTS 2024 Update Course"
- ID: 22 - "Global Business English"
- ID: 23 - "Smart Grammar with AI"
- ID: 24 - "VR English Conversation"
- ID: 25 - "English for Programmers"

### Khóa học đã phê duyệt (status = true)
- Tất cả các khóa học có ID từ 1-20

## Trạng thái khóa học

### Status = false (Chờ phê duyệt)
- Khóa học không hiển thị cho học viên
- Chỉ admin có thể xem và quản lý
- Có thể phê duyệt hoặc từ chối

### Status = true (Đã phê duyệt)
- Khóa học hiển thị công khai
- Học viên có thể mua và học
- Xuất hiện trong tìm kiếm và danh sách

## Thống kê

Dashboard admin hiển thị:
- Tổng số khóa học
- Số khóa học đã phê duyệt
- Số khóa học chờ phê duyệt
- Thống kê theo danh mục
- Giá trung bình
- Rating trung bình

## Quyền truy cập

### ADMIN
- Xem tất cả khóa học
- Phê duyệt/từ chối khóa học
- Xem thống kê

### SELLER
- Tạo khóa học mới (status = false)
- Xem khóa học của mình
- Chỉnh sửa khóa học chưa phê duyệt

### USER
- Chỉ xem khóa học đã phê duyệt
- Mua và học khóa học

## Lưu ý kỹ thuật

### Security
- Sử dụng `@PreAuthorize("hasRole('ADMIN')")` để bảo vệ API
- JWT token validation
- CORS configuration cho frontend

### Database
- Trường `status` trong bảng `course`
- Ràng buộc khóa ngoại với `users` và `category`
- Cascade delete cho course details

### Frontend
- Protected routes cho admin
- Real-time updates sau khi phê duyệt
- Error handling và user feedback

## Troubleshooting

### Không thể truy cập trang admin
- Kiểm tra quyền ADMIN trong database
- Đảm bảo JWT token hợp lệ
- Kiểm tra role trong token

### API trả về 403 Forbidden
- Kiểm tra header Authorization
- Đảm bảo role ADMIN trong token
- Xác nhận endpoint URL đúng

### Không thấy khóa học chờ phê duyệt
- Kiểm tra có khóa học nào có `status = false`
- Refresh trang hoặc clear cache
- Kiểm tra filter settings 