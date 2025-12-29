# Authentication, Database & Role Management Issues - Analysis & Solutions

## 🔴 Critical Issues Identified

### 1. **Authentication Flow Problems**

#### Issues

- ❌ **No Backend Integration**: Frontend uses `localStorage` only, no API calls
- ❌ **Passwords Stored in Plain Text**: Security vulnerability
- ❌ **No JWT Tokens**: No secure session management
- ❌ **No Backend Validation**: All auth logic is client-side
- ❌ **Database Not Used**: SQLite database exists but auth doesn't use it

#### Current Flow (BROKEN)

```
User Login → localStorage Check → Success/Fail
```

#### Proper Flow (NEEDED)

```
User Login → Backend API → Database Check → JWT Token → Success
```

---

### 2. **Role Management Issues**

#### Issues

- ❌ **Inconsistent Role Storage**: Sometimes `role`, sometimes `roles` array
- ❌ **No Role Validation**: Users can change roles client-side
- ❌ **No Permission Enforcement**: Backend doesn't check roles
- ❌ **Conflicting Logic**: `getUserRole()` vs `hasRole()` confusion

#### Current Problems

```javascript
// Line 90: Uses single 'role'
role: profileData.role || USER_ROLES.DONOR

// Line 113: Uses 'roles' array
roles: user.roles?.includes(newRole)

// Line 264: Registration uses 'roles' array
roles: [selectedRole]
```

---

### 3. **Database Schema Issues**

#### Missing Tables

- ❌ No `auth_tokens` table for JWT management
- ❌ No `user_roles` table for role assignments
- ❌ No `permissions` table for fine-grained access
- ❌ No `sessions` table for session tracking

#### Missing Columns in `users` table

- ❌ No `password_hash` column
- ❌ No `role` or `roles` column
- ❌ No `last_login` column
- ❌ No `is_active` column
- ❌ No `email_verified` column

---

### 4. **Security Issues**

#### Critical Vulnerabilities

1. **Plain Text Passwords** (Line 263 in UserContext.jsx)

   ```javascript
   password, // In production, this should be hashed
   ```

2. **No HTTPS Enforcement**
3. **No CSRF Protection**
4. **No Rate Limiting**
5. **No Input Sanitization**
6. **localStorage for Sensitive Data**

---

## ✅ Comprehensive Solution

### Phase 1: Fix Database Schema

#### Add Missing Columns to `users` Table

```sql
ALTER TABLE users ADD COLUMN password_hash TEXT;
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'donor';
ALTER TABLE users ADD COLUMN roles TEXT DEFAULT '["donor"]';  -- JSON array
ALTER TABLE users ADD COLUMN is_active INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN last_login TEXT;
ALTER TABLE users ADD COLUMN failed_login_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN locked_until TEXT;
```

#### Create New Tables

```sql
-- Auth Tokens (JWT)
CREATE TABLE auth_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    refresh_token TEXT UNIQUE,
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    revoked INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User Sessions
CREATE TABLE user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_token TEXT UNIQUE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    last_activity TEXT DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Permissions
CREATE TABLE permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Role Permissions (Many-to-Many)
CREATE TABLE role_permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL,
    permission_id INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Audit Log
CREATE TABLE audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    details TEXT,  -- JSON
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

### Phase 2: Backend Authentication API

#### Create Auth Router (`app/routers/auth.py`)

```python
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr
import sqlite3

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# Pydantic models
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    wallet_address: str
    role: str = "donor"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict

# Helper functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Routes
@router.post("/register", response_model=Token)
async def register(user_data: UserRegister):
    # Implementation here
    pass

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    # Implementation here
    pass

@router.post("/refresh")
async def refresh_token(refresh_token: str):
    # Implementation here
    pass

@router.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    # Implementation here
    pass

@router.get("/me")
async def get_current_user(token: str = Depends(oauth2_scheme)):
    # Implementation here
    pass
```

---

### Phase 3: Fix Frontend Auth Context

#### Key Changes Needed

1. **Remove localStorage for passwords**
2. **Use JWT tokens**
3. **Call backend API**
4. **Consistent role management**
5. **Proper error handling**

---

### Phase 4: Role-Based Access Control (RBAC)

#### Define Permissions

```javascript
export const PERMISSIONS = {
  // Project permissions
  CREATE_PROJECT: 'create_project',
  EDIT_PROJECT: 'edit_project',
  DELETE_PROJECT: 'delete_project',
  VIEW_PROJECT: 'view_project',
  
  // Donation permissions
  MAKE_DONATION: 'make_donation',
  VIEW_DONATIONS: 'view_donations',
  
  // Freelancer permissions
  CREATE_GIG: 'create_gig',
  MANAGE_ORDERS: 'manage_orders',
  
  // Governance permissions
  VOTE: 'vote',
  CREATE_PROPOSAL: 'create_proposal',
  
  // Admin permissions
  MANAGE_USERS: 'manage_users',
  MANAGE_PLATFORM: 'manage_platform',
};

export const ROLE_PERMISSIONS = {
  [USER_ROLES.DONOR]: [
    PERMISSIONS.VIEW_PROJECT,
    PERMISSIONS.MAKE_DONATION,
    PERMISSIONS.VIEW_DONATIONS,
  ],
  [USER_ROLES.CREATOR]: [
    PERMISSIONS.VIEW_PROJECT,
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.EDIT_PROJECT,
    PERMISSIONS.MAKE_DONATION,
  ],
  [USER_ROLES.FREELANCER]: [
    PERMISSIONS.VIEW_PROJECT,
    PERMISSIONS.CREATE_GIG,
    PERMISSIONS.MANAGE_ORDERS,
    PERMISSIONS.MAKE_DONATION,
  ],
  [USER_ROLES.GOVERNOR]: [
    PERMISSIONS.VIEW_PROJECT,
    PERMISSIONS.VOTE,
    PERMISSIONS.CREATE_PROPOSAL,
    PERMISSIONS.MAKE_DONATION,
  ],
  [USER_ROLES.ADMIN]: Object.values(PERMISSIONS),
};
```

---

## 🎯 Implementation Priority

### Immediate (Critical)

1. ✅ Fix database schema - add missing columns
2. ✅ Implement password hashing
3. ✅ Create backend auth API
4. ✅ Remove plain text password storage

### High Priority

5. ✅ Implement JWT authentication
6. ✅ Fix role management consistency
7. ✅ Add backend role validation
8. ✅ Create auth middleware

### Medium Priority

9. ✅ Add session management
10. ✅ Implement refresh tokens
11. ✅ Add audit logging
12. ✅ Add rate limiting

### Nice to Have

13. ✅ Email verification
14. ✅ Password reset flow
15. ✅ Two-factor authentication
16. ✅ Social login (Google, GitHub)

---

## 📊 Current vs Proposed Architecture

### Current (BROKEN)

```
Frontend (React)
    ↓
localStorage (Plain Text Passwords!)
    ↓
No Backend Validation
    ↓
SQLite Database (Not Used!)
```

### Proposed (SECURE)

```
Frontend (React)
    ↓
Backend API (FastAPI)
    ↓
JWT Authentication
    ↓
Password Hashing (bcrypt)
    ↓
SQLite Database
    ↓
Role-Based Access Control
    ↓
Audit Logging
```

---

## 🔒 Security Checklist

- [ ] Hash all passwords with bcrypt
- [ ] Use JWT for authentication
- [ ] Implement HTTPS only
- [ ] Add CSRF protection
- [ ] Implement rate limiting
- [ ] Sanitize all inputs
- [ ] Add SQL injection protection
- [ ] Implement session timeout
- [ ] Add account lockout after failed attempts
- [ ] Log all authentication events
- [ ] Validate email addresses
- [ ] Implement password strength requirements
- [ ] Add secure password reset flow
- [ ] Use secure HTTP headers
- [ ] Implement CORS properly

---

## 📝 Next Steps

1. **Review this document** with the team
2. **Prioritize fixes** based on severity
3. **Create migration scripts** for database changes
4. **Implement backend auth API** first
5. **Update frontend** to use new API
6. **Test thoroughly** before deployment
7. **Update documentation**

---

*Generated: December 12, 2025*
*Status: Awaiting Implementation*
