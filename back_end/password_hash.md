# Password Hash Instructions

## Để tạo hash cho password "@Minhquoc09072003" cho tài khoản mlnhquxc:

### Method 1: Sử dụng Online BCrypt Generator
1. Truy cập: https://bcrypt-generator.com/
2. Nhập password: `@Minhquoc09072003`
3. Chọn rounds: 10
4. Copy hash result

### Method 2: Sử dụng Java trong project
```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHasher {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
        String password = "@Minhquoc09072003";
        String hashedPassword = encoder.encode(password);
        System.out.println("Hash: " + hashedPassword);
    }
}
```

### Method 3: Update trong database
Nếu cần cập nhật password sau khi hệ thống đã chạy, sử dụng:
```sql
UPDATE users 
SET password = '$2a$10$[HASH_VALUE_HERE]' 
WHERE username = 'mlnhquxc';
```

## Current Status:
- Username: mlnhquxc
- Email: quangminhnguyn26@gmail.com  
- Password: @Minhquoc09072003
- Hash THẬT đã sử dụng: $2a$10$ysUMZrzTiyiyQfcGp7QP6e9xPHcZDF0.fkzGzpnD6F4A2FE3czqoi

**✅ HOÀN THÀNH:** Hash đã được tạo bằng Maven wrapper và cập nhật trong data.sql. Tài khoản sẵn sàng để đăng nhập test! 