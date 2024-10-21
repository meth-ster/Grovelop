#!/usr/bin/env python3
"""
Comprehensive Backend Testing for Grovelop Career Development Platform
Tests for expected endpoints based on the career development platform requirements
"""

import requests
import json
import sys
from datetime import datetime

# Use the production URL from frontend .env
BASE_URL = "https://skill-navigator-5.preview.emergentagent.com/api"

class ComprehensiveBackendTester:
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
    
    def test_endpoint_exists(self, endpoint, method="GET", description=""):
        """Test if an endpoint exists"""
        try:
            if method == "GET":
                response = self.session.get(f"{self.base_url}{endpoint}", timeout=10)
            elif method == "POST":
                response = self.session.post(f"{self.base_url}{endpoint}", json={}, timeout=10)
            elif method == "PUT":
                response = self.session.put(f"{self.base_url}{endpoint}", json={}, timeout=10)
            elif method == "DELETE":
                response = self.session.delete(f"{self.base_url}{endpoint}", timeout=10)
            
            # 404 means endpoint doesn't exist, anything else means it exists
            if response.status_code == 404:
                self.log_test(f"{method} {endpoint}", False, f"Endpoint not implemented - {description}")
                return False
            else:
                self.log_test(f"{method} {endpoint}", True, f"Endpoint exists (HTTP {response.status_code}) - {description}")
                return True
                
        except requests.exceptions.RequestException as e:
            self.log_test(f"{method} {endpoint}", False, f"Request failed: {str(e)}")
            return False
    
    def test_expected_career_platform_endpoints(self):
        """Test for endpoints expected in a career development platform"""
        
        print("Testing for expected career development platform endpoints...")
        print()
        
        # Authentication endpoints
        auth_endpoints = [
            ("/auth/register", "POST", "User registration"),
            ("/auth/login", "POST", "User login"),
            ("/auth/logout", "POST", "User logout"),
            ("/auth/refresh", "POST", "Token refresh"),
            ("/auth/me", "GET", "Get current user info"),
        ]
        
        # User profile endpoints
        profile_endpoints = [
            ("/users/profile", "GET", "Get user profile"),
            ("/users/profile", "PUT", "Update user profile"),
            ("/users/avatar", "POST", "Upload user avatar"),
        ]
        
        # Career assessment endpoints
        assessment_endpoints = [
            ("/assessments", "GET", "Get available assessments"),
            ("/assessments", "POST", "Create/submit assessment"),
            ("/assessments/results", "GET", "Get assessment results"),
        ]
        
        # Job-related endpoints
        job_endpoints = [
            ("/jobs", "GET", "Get job listings"),
            ("/jobs/search", "GET", "Search jobs"),
            ("/jobs/recommendations", "GET", "Get job recommendations"),
            ("/jobs/saved", "GET", "Get saved jobs"),
            ("/jobs/saved", "POST", "Save a job"),
            ("/jobs/applications", "GET", "Get job applications"),
            ("/jobs/applications", "POST", "Apply to job"),
        ]
        
        # Document management endpoints
        document_endpoints = [
            ("/documents", "GET", "Get user documents"),
            ("/documents", "POST", "Upload document"),
            ("/documents/generate", "POST", "Generate document with AI"),
            ("/documents/templates", "GET", "Get document templates"),
        ]
        
        # Activity/Portfolio endpoints
        activity_endpoints = [
            ("/activities", "GET", "Get user activities"),
            ("/activities", "POST", "Add activity"),
            ("/portfolio", "GET", "Get user portfolio"),
        ]
        
        all_endpoints = (
            auth_endpoints + 
            profile_endpoints + 
            assessment_endpoints + 
            job_endpoints + 
            document_endpoints + 
            activity_endpoints
        )
        
        existing_count = 0
        for endpoint, method, description in all_endpoints:
            if self.test_endpoint_exists(endpoint, method, description):
                existing_count += 1
        
        print(f"\nEndpoint Coverage: {existing_count}/{len(all_endpoints)} ({(existing_count/len(all_endpoints))*100:.1f}%)")
        return existing_count, len(all_endpoints)
    
    def test_api_documentation(self):
        """Test if API documentation is available"""
        docs_endpoints = [
            "/docs",
            "/redoc", 
            "/openapi.json"
        ]
        
        for endpoint in docs_endpoints:
            try:
                response = self.session.get(f"{self.base_url.replace('/api', '')}{endpoint}", timeout=10)
                if response.status_code == 200:
                    self.log_test(f"API Documentation", True, f"Available at {endpoint}")
                    return True
            except:
                continue
        
        self.log_test("API Documentation", False, "No API documentation found at /docs, /redoc, or /openapi.json")
        return False
    
    def run_comprehensive_tests(self):
        """Run all comprehensive backend tests"""
        print("=" * 80)
        print("GROVELOP BACKEND - COMPREHENSIVE CAREER PLATFORM ANALYSIS")
        print("=" * 80)
        print(f"Testing backend at: {self.base_url}")
        print()
        
        # Test basic server health
        try:
            response = self.session.get(f"{self.base_url}/", timeout=10)
            if response.status_code == 200:
                self.log_test("Server Health", True, "Backend server is running")
            else:
                self.log_test("Server Health", False, f"Server returned HTTP {response.status_code}")
                return False
        except:
            self.log_test("Server Health", False, "Backend server is not accessible")
            return False
        
        print()
        
        # Test API documentation
        self.test_api_documentation()
        print()
        
        # Test expected endpoints
        existing, total = self.test_expected_career_platform_endpoints()
        
        # Summary
        print("\n" + "=" * 80)
        print("COMPREHENSIVE ANALYSIS SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Server Status: {'✅ RUNNING' if passed_tests > 0 else '❌ DOWN'}")
        print(f"Implemented Endpoints: {existing}/{total} ({(existing/total)*100:.1f}%)")
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        
        # Analysis
        print("\n" + "=" * 80)
        print("BACKEND IMPLEMENTATION ANALYSIS")
        print("=" * 80)
        
        if existing < 5:
            print("🔴 CRITICAL: Backend is severely under-implemented")
            print("   - Only basic status endpoints are available")
            print("   - Missing all core career platform functionality")
            print("   - Authentication, jobs, assessments, documents all missing")
        elif existing < 15:
            print("🟡 WARNING: Backend is partially implemented")
            print("   - Some core functionality may be missing")
            print("   - Career platform features need completion")
        else:
            print("🟢 GOOD: Backend appears well-implemented")
            print("   - Most expected endpoints are available")
        
        print(f"\nCurrent backend only implements:")
        print("- Basic health check (GET /api/)")
        print("- Status tracking (GET/POST /api/status)")
        print("- CORS middleware")
        print("- MongoDB integration")
        
        print(f"\nMissing critical career platform features:")
        print("- User authentication and authorization")
        print("- Career assessment system")
        print("- Job discovery and recommendations")
        print("- Document generation and management")
        print("- User profiles and portfolios")
        print("- Activity tracking")
        
        return existing > 0

if __name__ == "__main__":
    tester = ComprehensiveBackendTester()
    success = tester.run_comprehensive_tests()
    sys.exit(0 if success else 1)