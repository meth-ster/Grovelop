#!/usr/bin/env python3
"""
Comprehensive Backend Testing for Grovelop Career Development Platform
Tests FastAPI backend server endpoints and functionality
"""

import requests
import json
import sys
from datetime import datetime
import uuid

# Use the production URL from frontend .env
BASE_URL = "https://skill-navigator-5.preview.emergentagent.com/api"

class BackendTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.test_results = []
        self.session = requests.Session()
        
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
    
    def test_status_post_endpoint(self):
        """Test POST /api/status endpoint"""
        try:
            test_data = {
                "client_name": "test_client_grovelop_career_platform"
            }
            
            response = self.session.post(
                f"{self.base_url}/status",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                # Validate response structure
                required_fields = ["id", "client_name", "timestamp"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("POST /status", False, f"Missing fields in response: {missing_fields}")
                    return False
                
                if data["client_name"] != test_data["client_name"]:
                    self.log_test("POST /status", False, "Client name mismatch in response")
                    return False
                
                # Validate UUID format
                try:
                    uuid.UUID(data["id"])
                except ValueError:
                    self.log_test("POST /status", False, "Invalid UUID format in response")
                    return False
                
                # Validate timestamp format
                try:
                    datetime.fromisoformat(data["timestamp"].replace('Z', '+00:00'))
                except ValueError:
                    self.log_test("POST /status", False, "Invalid timestamp format in response")
                    return False
                
                self.log_test("POST /status", True, "Status creation successful", data)
                return True
            else:
                self.log_test("POST /status", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("POST /status", False, f"Request failed: {str(e)}")
            return False
    
    def test_status_get_endpoint(self):
        """Test GET /api/status endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/status", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if not isinstance(data, list):
                    self.log_test("GET /status", False, "Response should be a list")
                    return False
                
                # If there are items, validate structure
                if data:
                    first_item = data[0]
                    required_fields = ["id", "client_name", "timestamp"]
                    missing_fields = [field for field in required_fields if field not in first_item]
                    
                    if missing_fields:
                        self.log_test("GET /status", False, f"Missing fields in response items: {missing_fields}")
                        return False
                
                self.log_test("GET /status", True, f"Retrieved {len(data)} status records")
                return True
            else:
                self.log_test("GET /status", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("GET /status", False, f"Request failed: {str(e)}")
            return False
    
    def test_invalid_endpoint(self):
        """Test behavior with invalid endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/nonexistent", timeout=10)
            
            if response.status_code == 404:
                self.log_test("Invalid Endpoint Handling", True, "Correctly returns 404 for invalid endpoints")
                return True
            else:
                self.log_test("Invalid Endpoint Handling", False, f"Expected 404, got {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Invalid Endpoint Handling", False, f"Request failed: {str(e)}")
            return False
    
    def test_cors_headers(self):
        """Test CORS configuration"""
        try:
            response = self.session.options(f"{self.base_url}/", timeout=10)
            
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
                self.log_test("CORS Configuration", True, "CORS headers properly configured")
                return True
            else:
                self.log_test("CORS Configuration", False, f"Missing CORS headers: {missing_headers}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("CORS Configuration", False, f"Request failed: {str(e)}")
            return False
    
    def test_malformed_post_data(self):
        """Test POST endpoint with malformed data"""
        try:
            # Test with missing required field
            response = self.session.post(
                f"{self.base_url}/status",
                json={},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 422:  # FastAPI validation error
                self.log_test("Malformed Data Handling", True, "Correctly validates required fields")
                return True
            else:
                self.log_test("Malformed Data Handling", False, f"Expected 422, got {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Malformed Data Handling", False, f"Request failed: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 60)
        print("GROVELOP BACKEND TESTING - COMPREHENSIVE TEST SUITE")
        print("=" * 60)
        print(f"Testing backend at: {self.base_url}")
        print()
        
        # Test server health first
        if not self.test_server_health():
            print("\n❌ CRITICAL: Server is not accessible. Stopping tests.")
            return False
        
        # Run all other tests
        tests = [
            self.test_status_post_endpoint,
            self.test_status_get_endpoint,
            self.test_invalid_endpoint,
            self.test_cors_headers,
            self.test_malformed_post_data
        ]
        
        for test in tests:
            test()
            print()
        
        # Summary
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print("=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\nFAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"- {result['test']}: {result['message']}")
        
        return failed_tests == 0

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)