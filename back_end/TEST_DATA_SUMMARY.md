# TEST DATA SUMMARY

## 🎯 **TỔNG QUAN DููLIỆU TEST ĐÃ TẠO**

### 👤 **TÀI KHOẢN SELLER MỚI** ✅
```
Username: mlnhquxc
Email: quangminhnguyn26@gmail.com
Password: @Minhquoc09072003
Full Name: Quang Minh Nguyễn
Role: SELLER
Phone: 0903456789
Status: Active
Certificate: IELTS 8.5, TOEIC 950, TESOL Certificate
Hash: $2a$10$ysUMZrzTiyiyQfcGp7QP6e9xPHcZDF0.fkzGzpnD6F4A2FE3czqoi
```

### 📚 **KHÓA HỌC CỦA SELLER mlnhquxc (User ID: 5)**

1. **IELTS Speaking Mastery 2024** (ID: 16)
   - Category: IELTS
   - Price: $159.99
   - Rating: 4.9
   - Episodes: 4 videos

2. **IELTS Writing Excellence** (ID: 17)
   - Category: IELTS  
   - Price: $179.99
   - Rating: 4.8
   - Episodes: 3 videos

3. **Business English Fundamentals** (ID: 18)
   - Category: Business English
   - Price: $139.99
   - Rating: 4.7
   - Episodes: 3 videos

4. **English Conversation Mastery** (ID: 19)
   - Category: Conversation
   - Price: $99.99
   - Rating: 4.6
   - Episodes: 3 videos

5. **English Grammar Complete Guide** (ID: 20)
   - Category: Grammar
   - Price: $119.99
   - Rating: 4.5
   - Episodes: 2 videos

### 👥 **STUDENT TEST ACCOUNTS**

**Student 1 (User ID: 6)**
```
Username: student1
Email: student1@test.com
Full Name: Nguyễn Văn A
Role: USER
Phone: 0912345678
Password: Test123456 (same hash as other test accounts)
```

**Student 2 (User ID: 7)**
```
Username: student2
Email: student2@test.com
Full Name: Trần Thị B
Role: USER
Phone: 0987654321
Password: Test123456 (same hash as other test accounts)
```

### 🛍️ **ORDERS (ĐƠNHÀNG ĐÃ MUA)**

| Order ID | Course ID | Course Name | User | Student Name |
|----------|-----------|-------------|------|--------------|
| 5 | 16 | IELTS Speaking Mastery 2024 | 6 | Nguyễn Văn A |
| 6 | 17 | IELTS Writing Excellence | 6 | Nguyễn Văn A |
| 7 | 18 | Business English Fundamentals | 7 | Trần Thị B |
| 8 | 19 | English Conversation Mastery | 7 | Trần Thị B |
| 9 | 20 | English Grammar Complete Guide | 6 | Nguyễn Văn A |
| 10 | 16 | IELTS Speaking Mastery 2024 | 7 | Trần Thị B |
| 11 | 18 | Business English Fundamentals | 6 | Nguyễn Văn A |

### ⭐ **COURSE RATINGS**

| Rating ID | Course ID | User ID | Rating | Date |
|-----------|-----------|---------|--------|------|
| 3 | 16 | 6 | 5★ | 2024-12-01 |
| 4 | 17 | 6 | 5★ | 2024-12-02 |
| 5 | 18 | 7 | 4★ | 2024-12-03 |
| 6 | 19 | 7 | 5★ | 2024-12-04 |
| 7 | 20 | 6 | 4★ | 2024-12-05 |

### ❤️ **FAVORITES**

| User ID | Course ID | Course Name |
|---------|-----------|-------------|
| 6 | 16 | IELTS Speaking Mastery 2024 |
| 7 | 17 | IELTS Writing Excellence |
| 6 | 18 | Business English Fundamentals |

## 📊 **THỐNG KÊ CHO SELLER mlnhquxc**

- **Tổng khóa học:** 5
- **Tổng đơn hàng:** 7 orders
- **Tổng học viên:** 2 unique students
- **Tổng rating:** 5 ratings (avg 4.6/5)
- **Tổng doanh thu:** $758.92 (từ 7 orders)

## 🧪 **HƯỚNG DẪN TEST**

### 1. **Login Seller Account:**
```
URL: /login
Username: mlnhquxc
Password: @Minhquoc09072003
```

### 2. **Access Seller Dashboard:**
```
URL: /seller/dashboard
- Xem danh sách 5 khóa học
- Xem thống kê doanh thu 
- Test CRUD operations
```

### 3. **Test Student Accounts:**
```
Login as student1 hoặc student2
- Xem courses đã mua
- Rate courses
- Add to favorites
```

### 4. **APIs để test:**
```
GET /seller/5/courses/managed - Lấy khóa học của seller
GET /seller/5/stats - Thống kê seller
GET /seller/5/revenue - Doanh thu seller
POST /seller/5/courses - Tạo khóa học mới
PUT /seller/5/courses/{id} - Cập nhật khóa học
DELETE /seller/5/courses/{id} - Xóa khóa học
```

## ✅ **DATA ĐÃ SẴN SÀNG**
- ✅ Seller account with REAL password hash (generated with Maven wrapper)
- ✅ 5 courses với episodes đầy đủ
- ✅ 2 student accounts với orders
- ✅ Ratings và favorites realistic
- ✅ Revenue data cho testing dashboard
- ✅ All foreign keys linked correctly
- ✅ Password hash: `$2a$10$ysUMZrzTiyiyQfcGp7QP6e9xPHcZDF0.fkzGzpnD6F4A2FE3czqoi`

**🎉 HỆ THỐNG HOÀN TOÀN SẴN SÀNG CHO TESTING!** 🚀

### 📝 **Lệnh Maven wrapper đã sử dụng:**
```bash
./mvnw compile exec:java -Dexec.mainClass="com.example.back_end.utils.PasswordHashGenerator"
``` 