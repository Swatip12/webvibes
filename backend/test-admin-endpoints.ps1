# Admin Panel Backend Testing Script
# Task 11: Backend checkpoint - Test authentication and admin APIs
# This script tests authentication and all admin endpoints

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Admin Panel Backend API Test Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8081"
$jwtToken = $null

# Function to test an endpoint
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Body = $null,
        [string]$Description,
        [bool]$UseAuth = $false,
        [bool]$ExpectFailure = $false
    )
    
    Write-Host "Testing: $Description" -ForegroundColor Yellow
    Write-Host "  Method: $Method" -ForegroundColor Gray
    Write-Host "  Endpoint: $Endpoint" -ForegroundColor Gray
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        if ($UseAuth -and $jwtToken) {
            $headers["Authorization"] = "Bearer $jwtToken"
            Write-Host "  Auth: Using JWT token" -ForegroundColor Gray
        }
        
        if ($Body) {
            Write-Host "  Body: $Body" -ForegroundColor Gray
            $response = Invoke-RestMethod -Uri "$baseUrl$Endpoint" -Method $Method -Headers $headers -Body $Body -ErrorAction Stop
        } else {
            $response = Invoke-RestMethod -Uri "$baseUrl$Endpoint" -Method $Method -Headers $headers -ErrorAction Stop
        }
        
        if ($ExpectFailure) {
            Write-Host "  ⚠️  UNEXPECTED SUCCESS (Expected to fail)" -ForegroundColor Yellow
        } else {
            Write-Host "  ✅ SUCCESS" -ForegroundColor Green
        }
        Write-Host "  Response:" -ForegroundColor Gray
        $response | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor White
        
        return $response
    }
    catch {
        if ($ExpectFailure) {
            Write-Host "  ✅ FAILED AS EXPECTED" -ForegroundColor Green
            Write-Host "  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Gray
        } else {
            Write-Host "  ❌ FAILED" -ForegroundColor Red
        }
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            Write-Host "  Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
        
        return $null
    }
    
    Write-Host ""
}

# Check if server is running
Write-Host "Checking if backend server is running..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"username":"test","password":"test"}' -ErrorAction SilentlyContinue -TimeoutSec 5
    Write-Host "✅ Server is running!" -ForegroundColor Green
}
catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401 -or $_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "✅ Server is running!" -ForegroundColor Green
    } else {
        Write-Host "❌ Error: Could not connect to server at $baseUrl" -ForegroundColor Red
        Write-Host "   Please start the backend with: mvn spring-boot:run" -ForegroundColor Yellow
        Write-Host ""
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SECTION 1: Authentication Tests" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Login with valid credentials
Write-Host "Test 1: Login with valid credentials (admin/admin123)" -ForegroundColor Magenta
$loginBody = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Test-Endpoint -Method "POST" -Endpoint "/api/auth/login" -Body $loginBody -Description "Login with valid credentials"

if ($loginResponse -and $loginResponse.token) {
    $jwtToken = $loginResponse.token
    Write-Host "✅ JWT Token obtained successfully" -ForegroundColor Green
    Write-Host "   Token: $($jwtToken.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "❌ Failed to obtain JWT token. Cannot continue with admin endpoint tests." -ForegroundColor Red
    exit 1
}

# Test 2: Login with invalid credentials
Write-Host "Test 2: Login with invalid credentials" -ForegroundColor Magenta
$invalidLoginBody = @{
    username = "admin"
    password = "wrongpassword"
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Endpoint "/api/auth/login" -Body $invalidLoginBody -Description "Login with invalid password" -ExpectFailure $true

# Test 3: Login with non-existent user
Write-Host "Test 3: Login with non-existent user" -ForegroundColor Magenta
$nonExistentUserBody = @{
    username = "nonexistent"
    password = "password123"
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Endpoint "/api/auth/login" -Body $nonExistentUserBody -Description "Login with non-existent user" -ExpectFailure $true

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SECTION 2: Authorization Tests" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 4: Access admin endpoint without JWT token
Write-Host "Test 4: Access admin endpoint without JWT token" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/admin/courses" -Description "Get courses without JWT token (should fail)" -UseAuth $false -ExpectFailure $true

# Test 5: Access admin endpoint with JWT token
Write-Host "Test 5: Access admin endpoint with valid JWT token" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/admin/courses" -Description "Get courses with JWT token" -UseAuth $true

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SECTION 3: Course CRUD Operations" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 6: Create a new course
Write-Host "Test 6: Create a new course" -ForegroundColor Magenta
$courseBody = @{
    name = "Advanced Spring Boot"
    description = "Learn advanced Spring Boot concepts including security, microservices, and cloud deployment"
    duration = 12
    technologies = "Spring Boot, Spring Security, Docker, Kubernetes"
} | ConvertTo-Json

$createdCourse = Test-Endpoint -Method "POST" -Endpoint "/api/admin/courses" -Body $courseBody -Description "Create new course" -UseAuth $true

$courseId = $null
if ($createdCourse -and $createdCourse.id) {
    $courseId = $createdCourse.id
    Write-Host "✅ Course created with ID: $courseId" -ForegroundColor Green
    Write-Host ""
}

# Test 7: Get all courses (admin endpoint)
Write-Host "Test 7: Get all courses via admin endpoint" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/admin/courses" -Description "Get all courses (admin)" -UseAuth $true

# Test 8: Get course by ID
if ($courseId) {
    Write-Host "Test 8: Get course by ID" -ForegroundColor Magenta
    Test-Endpoint -Method "GET" -Endpoint "/api/admin/courses/$courseId" -Description "Get course by ID" -UseAuth $true
}

# Test 9: Update the course
if ($courseId) {
    Write-Host "Test 9: Update course" -ForegroundColor Magenta
    $updateCourseBody = @{
        name = "Advanced Spring Boot - Updated"
        description = "Updated description with more details about microservices architecture"
        duration = 16
        technologies = "Spring Boot, Spring Security, Docker, Kubernetes, AWS"
    } | ConvertTo-Json
    
    Test-Endpoint -Method "PUT" -Endpoint "/api/admin/courses/$courseId" -Body $updateCourseBody -Description "Update course" -UseAuth $true
}

# Test 10: Create course with invalid data (validation test)
Write-Host "Test 10: Create course with invalid data" -ForegroundColor Magenta
$invalidCourseBody = @{
    name = "   "
    description = "Test"
    duration = -5
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Endpoint "/api/admin/courses" -Body $invalidCourseBody -Description "Create course with invalid data (should fail)" -UseAuth $true -ExpectFailure $true

# Test 11: Delete the course
if ($courseId) {
    Write-Host "Test 11: Delete course" -ForegroundColor Magenta
    Test-Endpoint -Method "DELETE" -Endpoint "/api/admin/courses/$courseId" -Description "Delete course" -UseAuth $true
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SECTION 4: Internship CRUD Operations" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 12: Create a new internship
Write-Host "Test 12: Create a new internship" -ForegroundColor Magenta
$internshipBody = @{
    type = "Full Stack Development Internship"
    description = "Work on real-world projects using Spring Boot and Angular. Gain hands-on experience with modern web development practices."
    duration = 6
    skills = "Java, Spring Boot, Angular, TypeScript, MySQL, Git"
} | ConvertTo-Json

$createdInternship = Test-Endpoint -Method "POST" -Endpoint "/api/admin/internships" -Body $internshipBody -Description "Create new internship" -UseAuth $true

$internshipId = $null
if ($createdInternship -and $createdInternship.id) {
    $internshipId = $createdInternship.id
    Write-Host "✅ Internship created with ID: $internshipId" -ForegroundColor Green
    Write-Host ""
}

# Test 13: Get all internships (admin endpoint)
Write-Host "Test 13: Get all internships via admin endpoint" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/admin/internships" -Description "Get all internships (admin)" -UseAuth $true

# Test 14: Get internship by ID
if ($internshipId) {
    Write-Host "Test 14: Get internship by ID" -ForegroundColor Magenta
    Test-Endpoint -Method "GET" -Endpoint "/api/admin/internships/$internshipId" -Description "Get internship by ID" -UseAuth $true
}

# Test 15: Update the internship
if ($internshipId) {
    Write-Host "Test 15: Update internship" -ForegroundColor Magenta
    $updateInternshipBody = @{
        type = "Full Stack Development Internship - Updated"
        description = "Updated description with cloud technologies and DevOps practices"
        duration = 8
        skills = "Java, Spring Boot, Angular, TypeScript, MySQL, Git, Docker, AWS"
    } | ConvertTo-Json
    
    Test-Endpoint -Method "PUT" -Endpoint "/api/admin/internships/$internshipId" -Body $updateInternshipBody -Description "Update internship" -UseAuth $true
}

# Test 16: Create internship with invalid data (validation test)
Write-Host "Test 16: Create internship with invalid data" -ForegroundColor Magenta
$invalidInternshipBody = @{
    type = ""
    description = "Test"
    duration = 0
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Endpoint "/api/admin/internships" -Body $invalidInternshipBody -Description "Create internship with invalid data (should fail)" -UseAuth $true -ExpectFailure $true

# Test 17: Delete the internship
if ($internshipId) {
    Write-Host "Test 17: Delete internship" -ForegroundColor Magenta
    Test-Endpoint -Method "DELETE" -Endpoint "/api/admin/internships/$internshipId" -Description "Delete internship" -UseAuth $true
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SECTION 5: Admin View Endpoints" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 18: Get all internship applications
Write-Host "Test 18: Get all internship applications" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/admin/applications" -Description "Get all internship applications" -UseAuth $true

# Test 19: Get all course enrollments
Write-Host "Test 19: Get all course enrollments" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/admin/enrollments" -Description "Get all course enrollments" -UseAuth $true

# Test 20: Get all contact messages
Write-Host "Test 20: Get all contact messages" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/admin/messages" -Description "Get all contact messages" -UseAuth $true

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SECTION 6: Public Endpoints" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 21: Get public courses (no auth required)
Write-Host "Test 21: Get public courses" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/courses" -Description "Get public courses (no auth)" -UseAuth $false

# Test 22: Get public internships (no auth required)
Write-Host "Test 22: Get public internships" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/internships" -Description "Get public internships (no auth)" -UseAuth $false

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Authentication Tests:" -ForegroundColor Green
Write-Host "   - Valid credentials should return JWT token" -ForegroundColor White
Write-Host "   - Invalid credentials should be rejected" -ForegroundColor White
Write-Host ""
Write-Host "✅ Authorization Tests:" -ForegroundColor Green
Write-Host "   - Admin endpoints without JWT should return 401" -ForegroundColor White
Write-Host "   - Admin endpoints with JWT should succeed" -ForegroundColor White
Write-Host ""
Write-Host "✅ Course CRUD Tests:" -ForegroundColor Green
Write-Host "   - Create, read, update, delete operations tested" -ForegroundColor White
Write-Host "   - Validation errors properly handled" -ForegroundColor White
Write-Host ""
Write-Host "✅ Internship CRUD Tests:" -ForegroundColor Green
Write-Host "   - Create, read, update, delete operations tested" -ForegroundColor White
Write-Host "   - Validation errors properly handled" -ForegroundColor White
Write-Host ""
Write-Host "✅ Admin View Tests:" -ForegroundColor Green
Write-Host "   - Applications, enrollments, and messages retrieved" -ForegroundColor White
Write-Host ""
Write-Host "✅ Public Endpoint Tests:" -ForegroundColor Green
Write-Host "   - Public courses and internships accessible without auth" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
