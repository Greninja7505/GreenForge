"""
Test Authentication Endpoints
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_root():
    """Test root endpoint"""
    print("\n" + "="*50)
    print("TEST 1: Root Endpoint")
    print("="*50)
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_register():
    """Test user registration"""
    print("\n" + "="*50)
    print("TEST 2: User Registration")
    print("="*50)
    
    data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "test123456",
        "wallet_address": "GABC123TESTWALLETADDRESS456789012345678901234567890123",
        "public_key": "GABC123TESTWALLETADDRESS456789012345678901234567890123",
        "role": "donor"
    }
    
    print(f"Request: {json.dumps(data, indent=2)}")
    response = requests.post(f"{BASE_URL}/api/auth/register", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        return response.json()
    return None

def test_login(email, password):
    """Test user login"""
    print("\n" + "="*50)
    print("TEST 3: User Login")
    print("="*50)
    
    data = {
        "email": email,
        "password": password
    }
    
    print(f"Request: {json.dumps(data, indent=2)}")
    response = requests.post(f"{BASE_URL}/api/auth/login", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        return response.json()
    return None

def test_get_current_user(access_token):
    """Test get current user"""
    print("\n" + "="*50)
    print("TEST 4: Get Current User")
    print("="*50)
    
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    response = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_wallet_connect():
    """Test wallet connection"""
    print("\n" + "="*50)
    print("TEST 5: Wallet Connection")
    print("="*50)
    
    data = {
        "wallet_address": "GDEF456ANOTHERWALLETADDRESS789012345678901234567890123",
        "public_key": "GDEF456ANOTHERWALLETADDRESS789012345678901234567890123",
        "signature": "test_signature_placeholder",
        "message": "Login to ChainFund",
        "wallet_type": "freighter"
    }
    
    print(f"Request: {json.dumps(data, indent=2)}")
    response = requests.post(f"{BASE_URL}/api/auth/wallet/connect", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        return response.json()
    return None

def test_logout(access_token):
    """Test logout"""
    print("\n" + "="*50)
    print("TEST 6: Logout")
    print("="*50)
    
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/logout", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_existing_endpoints():
    """Test that existing endpoints still work"""
    print("\n" + "="*50)
    print("TEST 7: Existing Projects Endpoint")
    print("="*50)
    
    response = requests.get(f"{BASE_URL}/api/v1/projects")
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Total Projects: {data.get('total', 0)}")
    return response.status_code == 200

def main():
    """Run all tests"""
    print("\n" + "🚀 " + "="*48)
    print("   CHAINFUND AUTHENTICATION API TESTS")
    print("="*50)
    
    results = []
    
    # Test 1: Root endpoint
    results.append(("Root Endpoint", test_root()))
    
    # Test 2: Register new user
    register_response = test_register()
    results.append(("User Registration", register_response is not None))
    
    if register_response:
        access_token = register_response.get("access_token")
        
        # Test 3: Login with credentials
        login_response = test_login("test@example.com", "test123456")
        results.append(("User Login", login_response is not None))
        
        if login_response:
            access_token = login_response.get("access_token")
        
        # Test 4: Get current user
        results.append(("Get Current User", test_get_current_user(access_token)))
        
        # Test 5: Wallet connection
        wallet_response = test_wallet_connect()
        results.append(("Wallet Connection", wallet_response is not None))
        
        # Test 6: Logout
        results.append(("Logout", test_logout(access_token)))
    
    # Test 7: Existing endpoints
    results.append(("Existing Endpoints", test_existing_endpoints()))
    
    # Print summary
    print("\n" + "="*50)
    print("📊 TEST SUMMARY")
    print("="*50)
    
    passed = 0
    failed = 0
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
        if result:
            passed += 1
        else:
            failed += 1
    
    print("\n" + "="*50)
    print(f"Total: {len(results)} | Passed: {passed} | Failed: {failed}")
    print("="*50 + "\n")
    
    if failed == 0:
        print("🎉 All tests passed!")
    else:
        print(f"⚠️  {failed} test(s) failed")

if __name__ == "__main__":
    try:
        main()
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Could not connect to server at http://localhost:8000")
        print("Make sure the backend server is running!")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
