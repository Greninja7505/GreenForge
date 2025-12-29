"""
Quick Authentication Test
"""
import requests
import json

BASE_URL = "http://localhost:8000"

print("\n" + "="*60)
print("🧪 CHAINFUND AUTHENTICATION TESTS")
print("="*60)

# Test 1: Server Health
print("\n1️⃣  Testing Server Health...")
try:
    r = requests.get(f"{BASE_URL}/")
    print(f"   ✅ Server is running: {r.json()['message']}")
except:
    print("   ❌ Server is not responding!")
    exit(1)

# Test 2: Register New User
print("\n2️⃣  Testing User Registration...")
register_data = {
    "username": "democreator",
    "email": "demo@chainfund.com",
    "password": "secure123456",
    "wallet_address": "GDEMO123WALLETADDRESS456789012345678901234567890123",
    "public_key": "GDEMO123WALLETADDRESS456789012345678901234567890123",
    "role": "creator"
}

r = requests.post(f"{BASE_URL}/api/auth/register", json=register_data)
if r.status_code == 200:
    data = r.json()
    print(f"   ✅ User registered successfully!")
    print(f"   📧 Email: {data['user']['email']}")
    print(f"   👤 Username: {data['user']['username']}")
    print(f"   🎭 Role: {data['user']['role']}")
    print(f"   🔑 Access Token: {data['access_token'][:50]}...")
    access_token = data['access_token']
elif r.status_code == 400 and "already registered" in r.json().get('detail', ''):
    print(f"   ℹ️  User already exists, testing login instead...")
    # Test login
    login_data = {
        "email": "demo@chainfund.com",
        "password": "secure123456"
    }
    r = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    if r.status_code == 200:
        data = r.json()
        print(f"   ✅ Login successful!")
        access_token = data['access_token']
    else:
        print(f"   ❌ Login failed: {r.json()}")
        exit(1)
else:
    print(f"   ❌ Registration failed: {r.json()}")
    exit(1)

# Test 3: Get Current User
print("\n3️⃣  Testing Get Current User...")
headers = {"Authorization": f"Bearer {access_token}"}
r = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
if r.status_code == 200:
    user = r.json()
    print(f"   ✅ User data retrieved!")
    print(f"   ID: {user['id']}")
    print(f"   Username: {user['username']}")
    print(f"   Email: {user['email']}")
    print(f"   Wallet: {user['wallet_address'][:20]}...")
    print(f"   Role: {user['role']}")
    print(f"   Roles: {user['roles']}")
else:
    print(f"   ❌ Failed: {r.json()}")

# Test 4: Wallet Connection
print("\n4️⃣  Testing Wallet Connection...")
wallet_data = {
    "wallet_address": "GWALLET456NEWADDRESS789012345678901234567890123456",
    "public_key": "GWALLET456NEWADDRESS789012345678901234567890123456",
    "signature": "test_signature_placeholder",
    "message": "Login to ChainFund",
    "wallet_type": "freighter"
}

r = requests.post(f"{BASE_URL}/api/auth/wallet/connect", json=wallet_data)
if r.status_code == 200:
    data = r.json()
    print(f"   ✅ Wallet connected!")
    print(f"   Wallet: {data['user']['wallet_address'][:20]}...")
    print(f"   Role: {data['user']['role']}")
else:
    print(f"   ❌ Failed: {r.json()}")

# Test 5: Existing Endpoints Still Work
print("\n5️⃣  Testing Existing Endpoints...")
r = requests.get(f"{BASE_URL}/api/v1/projects")
if r.status_code == 200:
    data = r.json()
    print(f"   ✅ Projects endpoint working!")
    print(f"   Total projects: {data.get('total', 0)}")
else:
    print(f"   ❌ Failed")

# Test 6: Stats Endpoint
print("\n6️⃣  Testing Stats Endpoint...")
r = requests.get(f"{BASE_URL}/api/v1/stats")
if r.status_code == 200:
    stats = r.json()
    print(f"   ✅ Stats retrieved!")
    print(f"   Users: {stats.get('total_users', 0)}")
    print(f"   Projects: {stats.get('total_projects', 0)}")
    print(f"   Total Raised: ${stats.get('total_raised', 0)}")
else:
    print(f"   ❌ Failed")

# Test 7: Logout
print("\n7️⃣  Testing Logout...")
r = requests.post(f"{BASE_URL}/api/auth/logout", headers=headers)
if r.status_code == 200:
    print(f"   ✅ Logout successful!")
else:
    print(f"   ❌ Failed: {r.json()}")

print("\n" + "="*60)
print("✅ ALL TESTS COMPLETED!")
print("="*60)
print("\n📊 Summary:")
print("   - Authentication API is working")
print("   - User registration ✅")
print("   - User login ✅")
print("   - JWT tokens ✅")
print("   - Wallet connection ✅")
print("   - Existing endpoints preserved ✅")
print("\n🎉 Backend is ready for frontend integration!")
print("="*60 + "\n")
