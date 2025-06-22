# SECURITY TESTING GUIDE

## 🧪 **HƯỚNG DẪN TEST BẢO MẬT SELLER ACCESS**

### **SETUP TESTING ENVIRONMENT**

1. **Start Backend:**
   ```bash
   cd back_end
   ./mvnw spring-boot:run
   ```

2. **Start Frontend:**
   ```bash
   cd front_end
   npm run dev
   ```

## 🔑 **TEST ACCOUNTS**

```
ADMIN Account:
Username: admin
Password: Tam123456@
Role: ADMIN

SELLER Account:
Username: mlnhquxc
Password: @Minhquoc09072003
Role: SELLER

USER Account:
Username: student1
Password: Test123456
Role: USER
```

## 🎯 **TEST SCENARIOS**

### **TEST 1: FRONTEND ROUTE PROTECTION**

#### **Test 1.1 - No Authentication**
```
Steps:
1. Open browser (incognito mode)
2. Navigate to: http://localhost:5173/seller/dashboard
Expected: Redirect to /auth/login ✅
```

#### **Test 1.2 - USER Role Access**
```
Steps:
1. Login with student1 account
2. Navigate to: http://localhost:5173/seller/dashboard
Expected: Redirect to / (homepage) ✅
```

#### **Test 1.3 - SELLER Role Access**
```
Steps:
1. Login with mlnhquxc account
2. Navigate to: http://localhost:5173/seller/dashboard
Expected: Access granted, show seller dashboard ✅
```

#### **Test 1.4 - ADMIN Role Access**
```
Steps:
1. Login with admin account
2. Navigate to: http://localhost:5173/seller/dashboard
Expected: Access granted, show seller dashboard ✅
```

### **TEST 2: BACKEND API PROTECTION**

#### **Test 2.1 - No Token**
```bash
curl -X GET http://localhost:8080/api/seller/5/stats
Expected: 401 Unauthorized ✅
```

#### **Test 2.2 - Invalid Token**
```bash
curl -X GET http://localhost:8080/api/seller/5/stats \
  -H "Authorization: Bearer invalid_token"
Expected: 401 Unauthorized ✅
```

#### **Test 2.3 - USER Role Token**
```bash
# 1. Login as USER to get token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student1@test.com","password":"Test123456"}'

# 2. Use token to access seller endpoint
curl -X GET http://localhost:8080/api/seller/5/stats \
  -H "Authorization: Bearer [USER_TOKEN]"
Expected: 403 Forbidden ✅
```

#### **Test 2.4 - SELLER Role Token**
```bash
# 1. Login as SELLER to get token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"quangminhnguyn26@gmail.com","password":"@Minhquoc09072003"}'

# 2. Use token to access seller endpoint
curl -X GET http://localhost:8080/api/seller/5/stats \
  -H "Authorization: Bearer [SELLER_TOKEN]"
Expected: 200 OK with stats data ✅
```

#### **Test 2.5 - ADMIN Role Token**
```bash
# 1. Login as ADMIN to get token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tamle7723@gmail.com","password":"Tam123456@"}'

# 2. Use token to access seller endpoint
curl -X GET http://localhost:8080/api/seller/5/stats \
  -H "Authorization: Bearer [ADMIN_TOKEN]"
Expected: 200 OK with stats data ✅
```

### **TEST 3: SPECIFIC ENDPOINT TESTING**

#### **Test 3.1 - Public Endpoints (Should Work for Everyone)**
```bash
# Get seller info by course ID (public)
curl -X GET http://localhost:8080/api/seller/1
Expected: 200 OK ✅

# Get seller's public courses (public)
curl -X GET http://localhost:8080/api/seller/5/courses
Expected: 200 OK ✅
```

#### **Test 3.2 - Protected Endpoints (SELLER/ADMIN Only)**
```bash
# Get managed courses (protected)
curl -X GET http://localhost:8080/api/seller/5/courses/managed \
  -H "Authorization: Bearer [SELLER_TOKEN]"
Expected: 200 OK ✅

# Get seller stats (protected)
curl -X GET http://localhost:8080/api/seller/5/stats \
  -H "Authorization: Bearer [SELLER_TOKEN]"
Expected: 200 OK ✅

# Get seller revenue (protected)
curl -X GET http://localhost:8080/api/seller/5/revenue \
  -H "Authorization: Bearer [SELLER_TOKEN]"
Expected: 200 OK ✅

# Create course (protected)
curl -X POST http://localhost:8080/api/seller/5/courses \
  -H "Authorization: Bearer [SELLER_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Course",
    "description": "Test Description",
    "price": 99.99,
    "categoryId": 1,
    "level": "Beginner",
    "totalHour": 10,
    "lessons": 5,
    "age": "18+ year old"
  }'
Expected: 200 OK with course created ✅
```

## 📊 **EXPECTED RESULTS MATRIX**

| Test Case | No Auth | USER Token | SELLER Token | ADMIN Token |
|-----------|---------|------------|--------------|-------------|
| `/seller/dashboard` (UI) | → `/auth/login` | → `/` | ✅ Access | ✅ Access |
| `GET /seller/5/stats` | 401 | 403 | ✅ 200 | ✅ 200 |
| `POST /seller/5/courses` | 401 | 403 | ✅ 200 | ✅ 200 |
| `GET /seller/5/courses/managed` | 401 | 403 | ✅ 200 | ✅ 200 |
| `GET /seller/1` (public) | ✅ 200 | ✅ 200 | ✅ 200 | ✅ 200 |

## 🚨 **TROUBLESHOOTING**

### **Common Issues:**

1. **403 Forbidden for SELLER token:**
   - Check JWT token contains correct scope
   - Verify role assignment in database
   - Check @PreAuthorize syntax

2. **CORS errors:**
   - Verify frontend runs on http://localhost:5173
   - Check CORS configuration in SecurityConfig

3. **Token expiration:**
   - JWT tokens expire in 1 hour
   - Re-login to get fresh token

### **Debug Commands:**

```bash
# Decode JWT token to check scope
echo "[JWT_TOKEN]" | base64 -d

# Check user roles in database
mysql -u root -p
USE TMDT;
SELECT u.username, u.email, r.name as role 
FROM users u 
JOIN users_roles ur ON u.id = ur.user_id 
JOIN roles r ON ur.roles_name = r.name;
```

## ✅ **SUCCESS CRITERIA**

**Security implementation is CORRECT if:**
- ✅ Unauthorized users cannot access seller UI
- ✅ USER role cannot access seller APIs
- ✅ SELLER role can access their management features  
- ✅ ADMIN role can access all seller features
- ✅ Public endpoints work for everyone
- ✅ Proper HTTP status codes returned

## 🎯 **QUICK VERIFICATION**

**Fast test sequence:**
1. Open incognito browser → navigate to `/seller/dashboard` → should redirect to login ✅
2. Login as SELLER → navigate to `/seller/dashboard` → should show dashboard ✅
3. Use Postman/curl with SELLER token → call protected API → should return 200 ✅
4. Use Postman/curl with USER token → call protected API → should return 403 ✅

**🎉 If all above pass → Security is working correctly!** 