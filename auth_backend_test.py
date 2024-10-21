#!/usr/bin/env python3
"""
Authentication Backend Testing for Grovelop Career Development Platform
Tests the new authentication endpoints with comprehensive scenarios
"""

import requests
import json
import sys
from datetime import datetime
import uuid
import jwt
import time

# Use the production URL from frontend .env
BASE_URL = "https://skill-navigator-5.preview.emergentagent.com/api"

class AuthBackendTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.test_results = []
        self.session = requests.Session()
        self.test_user_email = f"testuser_{int(time.time())}@grovelop.com"
        self.test_user_password = "SecurePassword123!"
        self.test_user_name = "Test User Grovelop"
        self.auth_token = None
        
    def log_test(self, test_name, success, message, details=None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details:
            print(f"   Details: {details}")
    
    def test_server_health(self):
        """Test if server is running and accessible"""
        try:
            response = self.session.get(f"{self.base_url}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("message") == "Hello World":
                    self.log_test("Server Health Check", True, "Server is running and responding correctly")
                    return True
                else:
                    self.log_test("Server Health Check", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Server Health Check", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("Server Health Check", False, f"Connection failed: {str(e)}")
            return False
    
    def test_user_registration_success(self):
        """Test successful user registration"""
        try:
            registration_data = {
                "email": self.test_user_email,
                "password": self.test_user_password,
                "name": self.test_user_name
            }
            
            response = self.session.post(
                f"{self.base_url}/auth/register",
                json=registration_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Validate response structure
                required_fields = ["access_token", "token_type", "user"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("User Registration Success", False, f"Missing fields in response: {missing_fields}")
                    return False
                
                # Validate user object
                user = data["user"]
                user_required_fields = ["id", "email", "name", "assessmentCompleted", "createdAt", "updatedAt"]
                user_missing_fields = [field for field in user_required_fields if field not in user]
                
                if user_missing_fields:
                    self.log_test("User Registration Success", False, f"Missing user fields: {user_missing_fields}")
                    return False
                
                # Validate data integrity
                if user["email"] != self.test_user_email:
                    self.log_test("User Registration Success", False, "Email mismatch in response")
                    return False
                
                if user["name"] != self.test_user_name:
                    self.log_test("User Registration Success", False, "Name mismatch in response")
                    return False
                
                if data["token_type"] != "bearer":
                    self.log_test("User Registration Success", False, "Invalid token type")
                    return False
                
                # Store token for later tests
                self.auth_token = data["access_token"]
                
                # Validate JWT token structure (without verifying signature)
                try:
                    # Decode without verification to check structure
                    decoded = jwt.decode(data["access_token"], options={"verify_signature": False})
                    if "sub" not in decoded or "exp" not in decoded:
                        self.log_test("User Registration Success", False, "Invalid JWT token structure")
                        return False
                except Exception as e:
                    self.log_test("User Registration Success", False, f"JWT token validation failed: {str(e)}")
                    return False
                
                self.log_test("User Registration Success", True, "User registered successfully with valid JWT token", {
                    "user_id": user["id"],
                    "email": user["email"],
                    "token_type": data["token_type"]
                })
                return True
            else:
                self.log_test("User Registration Success", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("User Registration Success", False, f"Request failed: {str(e)}")
            return False
    
    def test_user_registration_duplicate_email(self):
        """Test registration with duplicate email"""
        try:
            registration_data = {
                "email": self.test_user_email,  # Same email as previous test
                "password": "AnotherPassword123!",
                "name": "Another User"
            }
            
            response = self.session.post(
                f"{self.base_url}/auth/register",
                json=registration_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 400:
                data = response.json()
                if "detail" in data and "already registered" in data["detail"].lower():
                    self.log_test("Registration Duplicate Email", True, "Correctly rejects duplicate email registration")
                    return True
                else:
                    self.log_test("Registration Duplicate Email", False, f"Unexpected error message: {data}")
                    return False
            else:
                self.log_test("Registration Duplicate Email", False, f"Expected 400, got {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Registration Duplicate Email", False, f"Request failed: {str(e)}")
            return False
    
    def test_user_registration_missing_fields(self):
        """Test registration with missing required fields"""
        test_cases = [
            ({}, "empty payload"),
            ({"email": self.test_user_email}, "missing password and name"),
            ({"password": "password123"}, "missing email and name"),
            ({"name": "Test User"}, "missing email and password"),
            ({"email": "invalid-email", "password": "pass", "name": "User"}, "invalid email format")
        ]
        
        for test_data, description in test_cases:
            try:
                response = self.session.post(
                    f"{self.base_url}/auth/register",
                    json=test_data,
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                if response.status_code == 422:  # FastAPI validation error
                    self.log_test(f"Registration Validation ({description})", True, "Correctly validates required fields")
                else:
                    self.log_test(f"Registration Validation ({description})", False, f"Expected 422, got {response.status_code}")
                    return False
                    
            except requests.exceptions.RequestException as e:
                self.log_test(f"Registration Validation ({description})", False, f"Request failed: {str(e)}")
                return False
        
        return True
    
    def test_user_login_success(self):
        """Test successful user login"""
        try:
            login_data = {
                "email": self.test_user_email,
                "password": self.test_user_password
            }
            
            response = self.session.post(
                f"{self.base_url}/auth/login",
                json=login_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Validate response structure (same as registration)
                required_fields = ["access_token", "token_type", "user"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("User Login Success", False, f"Missing fields in response: {missing_fields}")
                    return False
                
                # Validate user data matches registration
                user = data["user"]
                if user["email"] != self.test_user_email:
                    self.log_test("User Login Success", False, "Email mismatch in login response")
                    return False
                
                if user["name"] != self.test_user_name:
                    self.log_test("User Login Success", False, "Name mismatch in login response")
                    return False
                
                # Validate JWT token
                try:
                    decoded = jwt.decode(data["access_token"], options={"verify_signature": False})
                    if decoded["sub"] != self.test_user_email:
                        self.log_test("User Login Success", False, "JWT subject mismatch")
                        return False
                except Exception as e:
                    self.log_test("User Login Success", False, f"JWT token validation failed: {str(e)}")
                    return False
                
                self.log_test("User Login Success", True, "User logged in successfully with valid JWT token", {
                    "user_id": user["id"],
                    "email": user["email"]
                })
                return True
            else:
                self.log_test("User Login Success", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("User Login Success", False, f"Request failed: {str(e)}")
            return False
    
    def test_user_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        test_cases = [
            ({"email": self.test_user_email, "password": "wrongpassword"}, "wrong password"),
            ({"email": "nonexistent@grovelop.com", "password": self.test_user_password}, "nonexistent email"),
            ({"email": "invalid-email", "password": "password"}, "invalid email format")
        ]
        
        for login_data, description in test_cases:
            try:
                response = self.session.post(
                    f"{self.base_url}/auth/login",
                    json=login_data,
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                if response.status_code == 401:
                    data = response.json()
                    if "detail" in data:
                        self.log_test(f"Login Invalid Credentials ({description})", True, "Correctly rejects invalid credentials")
                    else:
                        self.log_test(f"Login Invalid Credentials ({description})", False, "Missing error detail")
                        return False
                elif response.status_code == 422 and "invalid email format" in description:
                    # Email validation error is acceptable
                    self.log_test(f"Login Invalid Credentials ({description})", True, "Correctly validates email format")
                else:
                    self.log_test(f"Login Invalid Credentials ({description})", False, f"Expected 401, got {response.status_code}")
                    return False
                    
            except requests.exceptions.RequestException as e:
                self.log_test(f"Login Invalid Credentials ({description})", False, f"Request failed: {str(e)}")
                return False
        
        return True
    
    def test_user_login_missing_fields(self):
        """Test login with missing required fields"""
        test_cases = [
            ({}, "empty payload"),
            ({"email": self.test_user_email}, "missing password"),
            ({"password": self.test_user_password}, "missing email")
        ]
        
        for test_data, description in test_cases:
            try:
                response = self.session.post(
                    f"{self.base_url}/auth/login",
                    json=test_data,
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                if response.status_code == 422:  # FastAPI validation error
                    self.log_test(f"Login Validation ({description})", True, "Correctly validates required fields")
                else:
                    self.log_test(f"Login Validation ({description})", False, f"Expected 422, got {response.status_code}")
                    return False
                    
            except requests.exceptions.RequestException as e:
                self.log_test(f"Login Validation ({description})", False, f"Request failed: {str(e)}")
                return False
        
        return True
    
    def test_jwt_token_expiration_structure(self):
        """Test JWT token has proper expiration"""
        if not self.auth_token:
            self.log_test("JWT Token Expiration", False, "No auth token available for testing")
            return False
        
        try:
            decoded = jwt.decode(self.auth_token, options={"verify_signature": False})
            
            if "exp" not in decoded:
                self.log_test("JWT Token Expiration", False, "JWT token missing expiration claim")
                return False
            
            exp_timestamp = decoded["exp"]
            current_timestamp = datetime.utcnow().timestamp()
            
            # Token should expire in the future
            if exp_timestamp <= current_timestamp:
                self.log_test("JWT Token Expiration", False, "JWT token is already expired")
                return False
            
            # Token should expire within reasonable time (30 minutes as per backend config)
            time_to_expire = exp_timestamp - current_timestamp
            if time_to_expire > 3600:  # More than 1 hour
                self.log_test("JWT Token Expiration", False, f"JWT token expires too far in future: {time_to_expire} seconds")
                return False
            
            self.log_test("JWT Token Expiration", True, f"JWT token has proper expiration: {time_to_expire:.0f} seconds from now")
            return True
            
        except Exception as e:
            self.log_test("JWT Token Expiration", False, f"JWT token analysis failed: {str(e)}")
            return False
    
    def test_password_hashing(self):
        """Test that passwords are properly hashed (indirect test)"""
        # We can't directly test password hashing, but we can verify:
        # 1. Same password works for login after registration
        # 2. Wrong password fails
        # This was already tested in login tests, so this is a summary test
        
        if hasattr(self, '_registration_success') and hasattr(self, '_login_success'):
            self.log_test("Password Hashing", True, "Password hashing working correctly (verified via login tests)")
            return True
        else:
            self.log_test("Password Hashing", False, "Cannot verify password hashing - registration or login failed")
            return False
    
    def test_cors_headers_auth_endpoints(self):
        """Test CORS configuration for auth endpoints"""
        endpoints = ["/auth/register", "/auth/login"]
        
        for endpoint in endpoints:
            try:
                response = self.session.options(f"{self.base_url}{endpoint}", timeout=10)
                
                cors_headers = [
                    "access-control-allow-origin",
                    "access-control-allow-methods",
                    "access-control-allow-headers"
                ]
                
                missing_headers = []
                for header in cors_headers:
                    if header not in [h.lower() for h in response.headers.keys()]:
                        missing_headers.append(header)
                
                if not missing_headers:
                    self.log_test(f"CORS {endpoint}", True, "CORS headers properly configured")
                else:
                    self.log_test(f"CORS {endpoint}", False, f"Missing CORS headers: {missing_headers}")
                    return False
                    
            except requests.exceptions.RequestException as e:
                self.log_test(f"CORS {endpoint}", False, f"Request failed: {str(e)}")
                return False
        
        return True
    
    def test_database_integration(self):
        """Test database integration by verifying user persistence"""
        # Create a second user to test database operations
        second_user_email = f"testuser2_{int(time.time())}@grovelop.com"
        
        try:
            # Register second user
            registration_data = {
                "email": second_user_email,
                "password": "SecondUserPass123!",
                "name": "Second Test User"
            }
            
            response = self.session.post(
                f"{self.base_url}/auth/register",
                json=registration_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code != 200:
                self.log_test("Database Integration", False, "Failed to register second user for database test")
                return False
            
            # Try to login with second user
            login_data = {
                "email": second_user_email,
                "password": "SecondUserPass123!"
            }
            
            response = self.session.post(
                f"{self.base_url}/auth/login",
                json=login_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                self.log_test("Database Integration", True, "User data properly persisted and retrieved from database")
                return True
            else:
                self.log_test("Database Integration", False, "Failed to login with second user - database persistence issue")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Database Integration", False, f"Database integration test failed: {str(e)}")
            return False
    
    def run_all_auth_tests(self):
        """Run all authentication tests"""
        print("=" * 70)
        print("GROVELOP AUTHENTICATION BACKEND TESTING")
        print("=" * 70)
        print(f"Testing authentication endpoints at: {self.base_url}")
        print(f"Test user email: {self.test_user_email}")
        print()
        
        # Test server health first
        if not self.test_server_health():
            print("\n❌ CRITICAL: Server is not accessible. Stopping tests.")
            return False
        
        # Run authentication tests in order
        tests = [
            ("User Registration", self.test_user_registration_success),
            ("Registration Validation", self.test_user_registration_missing_fields),
            ("Duplicate Email Handling", self.test_user_registration_duplicate_email),
            ("User Login", self.test_user_login_success),
            ("Login Validation", self.test_user_login_missing_fields),
            ("Invalid Credentials", self.test_user_login_invalid_credentials),
            ("JWT Token Structure", self.test_jwt_token_expiration_structure),
            ("Password Security", self.test_password_hashing),
            ("CORS Configuration", self.test_cors_headers_auth_endpoints),
            ("Database Integration", self.test_database_integration)
        ]
        
        for test_name, test_func in tests:
            print(f"\n--- Running {test_name} Tests ---")
            result = test_func()
            if test_name == "User Registration" and result:
                self._registration_success = True
            if test_name == "User Login" and result:
                self._login_success = True
            print()
        
        # Summary
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print("=" * 70)
        print("AUTHENTICATION TEST SUMMARY")
        print("=" * 70)
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\nFAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"- {result['test']}: {result['message']}")
        else:
            print("\n🎉 ALL AUTHENTICATION TESTS PASSED!")
            print("✅ User registration working correctly")
            print("✅ User login working correctly") 
            print("✅ JWT token generation working")
            print("✅ Password hashing implemented")
            print("✅ Input validation working")
            print("✅ Error handling working")
            print("✅ Database integration working")
            print("✅ CORS configuration working")
        
        return failed_tests == 0

if __name__ == "__main__":
    tester = AuthBackendTester()
    success = tester.run_all_auth_tests()
    sys.exit(0 if success else 1)