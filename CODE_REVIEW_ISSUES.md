# 📋 StellarForge Code Review - Issues & Improvements

## 📊 Summary

After a comprehensive code review of all pages, components, services, and contexts, I've identified the following issues and improvement opportunities:

---

## 🔴 CRITICAL ISSUES (Must Fix)

### 1. **Security: Password Storage in Plain Text** ⚠️

**File:** `src/context/UserContext.jsx` (Lines 207-240, 242-288)

**Issue:**

```javascript
// Line 215 - Comparing plain text passwords
const foundUser = users.find(
  (u) => u.email === email && u.password === password  // INSECURE!
);

// Line 263 - Storing plain text passwords
const newUser = {
  ...
  password, // In production, this should be hashed
};
```

**Fix:** Use the new backend authentication API (`/api/auth/login`, `/api/auth/register`) which properly hashes passwords and uses JWT tokens.

---

### 2. **Authentication Not Using Backend API** ⚠️

**File:** `src/context/UserContext.jsx`

**Issue:** Frontend stores users in localStorage and validates credentials locally. The backend auth API we created is not being used.

**Fix:** Update `UserContext.jsx` to call:

- `POST /api/auth/register` for registration
- `POST /api/auth/login` for login
- `GET /api/auth/me` for getting current user
- Store JWT tokens instead of user objects

---

### 3. **Hardcoded Demo/Test Values in Production Code** ⚠️

**Files:** Multiple pages

**Issues:**

```javascript
// HireGig.jsx - Hardcoded seller address
sellerAddress: gig.freelancer.walletAddress || "GXXXXXXXXXXXXXXXX"

// Donate.jsx - Demo mode sending to self
destinationAddress = publicKey; // Sends to self in demo mode

// ContractService.js - Hardcoded API URL
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

**Fix:** Remove demo/test logic for production, or add proper environment detection.

---

### 4. **No CSRF Protection**

**Issue:** Frontend makes API calls without CSRF tokens.

**Fix:** Add CSRF token handling to all POST/PUT/DELETE requests.

---

## 🟠 HIGH PRIORITY ISSUES

### 5. **Missing Error Boundaries on Critical Pages**

**Files:** `Donate.jsx`, `CreateProject.jsx`, `Dashboard.jsx`

**Issue:** If these pages crash, the entire app crashes.

**Fix:** Wrap each page in ErrorBoundary or add try-catch with fallback UI.

---

### 6. **No Loading States for Initial Data**

**Files:** `Projects.jsx`, `Dashboard.jsx`, `Profile.jsx`

**Issue:** Pages show empty content while data loads.

**Fix:** Add skeleton loaders using the existing `SkeletonLoaders.jsx` component.

---

### 7. **Unused Imports and Dead Code**

**Files:** Multiple

**Examples:**

```javascript
// Donate.jsx - Line 6-20: Many unused imports
import { Lock, Sparkles, ... } // Not all used

// HireGig.jsx - Line 48-51: Unused escrow functions defined but not fully implemented
const { createEscrow, getEscrowStatus } = useEscrowContract();
```

**Fix:** Remove unused imports with ESLint.

---

### 8. **Missing API Error Handling**

**File:** `src/services/ContractService.js`

**Issue:** API calls return `{ success: false, error }` but callers don't always check this.

**Fix:** Add consistent error handling wrapper.

```javascript
// Better pattern:
async safeApiCall(fn) {
  try {
    const result = await fn();
    if (!result.success) throw new Error(result.error);
    return result;
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
}
```

---

### 9. **Duplicate File: Donate.jsx.new and Donate.jsx.old**

**Location:** `src/pages/`

**Issue:** Old backup files should be removed.

**Fix:** Delete `Donate.jsx.new` and `Donate.jsx.old`.

---

## 🟡 MEDIUM PRIORITY ISSUES

### 10. **No Input Sanitization on Some Forms**

**File:** `HireGig.jsx` - Line 419

**Issue:** Requirements textarea doesn't sanitize input.

**Fix:** Use existing `sanitizeString()` from utils/validation.

---

### 11. **Inconsistent Styling Approach**

**Files:** Various

**Issue:** Some components use:

- Inline styles
- Tailwind classes
- Custom CSS classes

**Fix:** Standardize on Tailwind + CSS custom properties for theming.

---

### 12. **Missing Meta Tags for SEO**

**File:** `index.html`

**Issue:** Pages don't have dynamic meta tags.

**Fix:** Add react-helmet for dynamic SEO meta tags.

---

### 13. **No Rate Limiting on Frontend**

**Issue:** Users can spam buttons repeatedly.

**Fix:** Add debouncing to buttons and form submissions.

```javascript
import { useCallback } from 'react';
import { debounce } from 'lodash';

const handleSubmit = useCallback(debounce(async () => {
  // form logic
}, 300), []);
```

---

### 14. **Missing Accessibility (a11y)**

**Files:** Multiple components

**Issues:**

- Missing `aria-labels` on buttons
- Missing `role` attributes
- Form inputs without proper labels
- Low color contrast in some areas

**Fix:** Add ARIA attributes and improve contrast.

---

### 15. **Large Bundle Size - No Tree Shaking**

**File:** Package imports

**Issue:**

```javascript
import * as StellarSdk from '@stellar/stellar-sdk'; // Imports entire SDK
```

**Fix:** Import only needed functions:

```javascript
import { Horizon, Networks } from '@stellar/stellar-sdk';
```

---

## 🟢 LOW PRIORITY / NICE TO HAVE

### 16. **Missing TypeScript**

**Issue:** Project uses JavaScript without type safety.

**Recommendation:** Consider migrating to TypeScript for better maintainability.

---

### 17. **No Unit Tests**

**Issue:** No test files found.

**Recommendation:** Add Jest + React Testing Library for critical components.

---

### 18. **Missing i18n (Internationalization)**

**Issue:** All text is hardcoded in English.

**Recommendation:** Add i18next for multi-language support.

---

### 19. **No PWA Support**

**Issue:** App is not installable as PWA.

**Recommendation:** Add service worker and manifest.json.

---

### 20. **No Analytics/Telemetry**

**Issue:** No way to track user behavior.

**Recommendation:** Add privacy-respecting analytics (Plausible, Umami).

---

## 🔧 SPECIFIC FIXES NEEDED

### Fix 1: Update UserContext to Use Backend API

```javascript
// src/context/UserContext.jsx

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      setUser(data.user);
      setIsAnonymous(false);
      return { success: true };
    }
    
    return { success: false, error: data.detail || 'Login failed' };
  } catch (error) {
    return { success: false, error: 'Network error. Please try again.' };
  }
};
```

---

### Fix 2: Add Token Refresh Logic

```javascript
// src/utils/api.js

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (response.status === 401) {
    // Token expired, try refresh
    const refreshed = await refreshToken();
    if (refreshed) {
      return fetchWithAuth(url, options); // Retry
    }
    // Logout user
    window.location.href = '/signin';
  }
  
  return response;
};

const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) return false;
  
  try {
    const response = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${refresh}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      return true;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }
  
  return false;
};
```

---

### Fix 3: Add Loading Skeletons

```javascript
// In Projects.jsx, add:

import { ProjectSkeleton } from '../components/SkeletonLoaders';

// In the return, check loading state:
{loading ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(6)].map((_, i) => <ProjectSkeleton key={i} />)}
  </div>
) : (
  // Existing project cards
)}
```

---

### Fix 4: Remove Debug Console Logs

Many files have console.log statements that should be removed:

```javascript
// Create a logger utility:
// src/utils/logger.js
const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args) => isDev && console.log(...args),
  error: (...args) => console.error(...args), // Always log errors
  warn: (...args) => isDev && console.warn(...args),
};
```

---

## 📈 PERFORMANCE IMPROVEMENTS

### 1. **Lazy Load Images**

Use `LazyImage` component for all images.

### 2. **Memoize Expensive Calculations**

```javascript
const filteredProjects = useMemo(() => {
  // filtering logic
}, [projects, selectedCategory, searchTerm]);
```

### 3. **Virtual List for Large Data**

Use `react-virtual` for long lists.

### 4. **Code Splitting**

Already implemented with lazy() - good!

---

## 🎯 PRIORITY ACTION ITEMS

### Immediate (This Week)

1. ✅ Update UserContext to use backend auth API
2. ✅ Remove plain text password storage
3. ✅ Fix Freighter wallet detection (DONE)
4. ✅ Fix category filter (DONE)

### Short Term (2 Weeks)

5. Add proper error handling to all API calls
6. Add loading skeletons to all data-fetching pages
7. Remove unused imports and dead code
8. Add input validation/sanitization everywhere

### Medium Term (1 Month)

9. Add unit tests for critical paths
10. Add accessibility improvements
11. Optimize bundle size
12. Add rate limiting on buttons

---

## 📝 FILES TO CHECK/UPDATE

| File | Priority | Issues |
|------|----------|--------|
| UserContext.jsx | 🔴 CRITICAL | Plain text passwords, no backend API |
| Donate.jsx | 🟠 HIGH | Demo mode logic, error handling |
| CreateProject.jsx | 🟠 HIGH | Missing validation, error handling |
| ContractService.js | 🟠 HIGH | Error handling, API response validation |
| HireGig.jsx | 🟡 MEDIUM | Stub escrow, hardcoded values |
| Dashboard.jsx | 🟡 MEDIUM | No loading states |
| Profile.jsx | 🟡 MEDIUM | No loading states |
| Projects.jsx | 🟢 LOW | Already fixed category filter |
| StellarContext.jsx | 🟢 LOW | Already fixed Freighter detection |

---

## ✅ ALREADY GOOD

1. ✅ Code splitting with React.lazy()
2. ✅ Error boundary component exists
3. ✅ Toast notifications implemented
4. ✅ Skeleton loaders component exists
5. ✅ Input validation utilities exist
6. ✅ Responsive design implemented
7. ✅ Dark mode implemented
8. ✅ Modern UI with animations

---

*Report Generated: December 12, 2025*  
*Total Issues Found: 20*  
*Critical: 4 | High: 5 | Medium: 6 | Low: 5*
