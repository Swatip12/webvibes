# Backend API Endpoint Testing Script
# This script tests all REST endpoints of the WebVibes Technology backend

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "WebVibes Backend API Test Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8080"

# Function to test an endpoint
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Body = $null,
        [string]$Description
    )
    
    Write-Host "Testing: $Description" -ForegroundColor Yellow
    Write-Host "  Method: $Method" -ForegroundColor Gray
    Write-Host "  Endpoint: $Endpoint" -ForegroundColor Gray
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        if ($Body) {
            Write-Host "  Body: $Body" -ForegroundColor Gray
            $response = Invoke-RestMethod -Uri "$baseUrl$Endpoint" -Method $Method -Headers $headers -Body $Body -ErrorAction Stop
        } else {
            $response = Invoke-RestMethod -Uri "$baseUrl$Endpoint" -Method $Method -Headers $headers -ErrorAction Stop
        }
        
        Write-Host "  ✅ SUCCESS" -ForegroundColor Green
        Write-Host "  Response:" -ForegroundColor Gray
        $response | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor White
    }
    catch {
        Write-Host "  ❌ FAILED" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            Write-Host "  Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host ""
}

# Check if server is running
Write-Host "Checking if backend server is running..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/actuator/health" -Method GET -ErrorAction SilentlyContinue
    Write-Host "✅ Server is running!" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Warning: Could not connect to server at $baseUrl" -ForegroundColor Yellow
    Write-Host "   Make sure the backend is running with: mvn spring-boot:run" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue with tests anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Starting API Tests" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Internship Application
$internshipBody = @{
    studentName = "John Doe"
    email = "john.doe@example.com"
    phone = "1234567890"
    internshipType = "Java Internship"
    message = "I am very interested in the Java internship program"
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Endpoint "/api/internships/apply" -Body $internshipBody -Description "Submit Internship Application"

# Test 2: Course Enrollment
$courseBody = @{
    studentName = "Jane Smith"
    email = "jane.smith@example.com"
    phone = "9876543210"
    courseName = "Spring Boot"
    message = "Looking forward to learning Spring Boot"
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Endpoint "/api/courses/enroll" -Body $courseBody -Description "Submit Course Enrollment"

# Test 3: Contact Message
$contactBody = @{
    name = "Alice Johnson"
    email = "alice.johnson@example.com"
    message = "I would like more information about your training programs and internship opportunities"
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Endpoint "/api/contact" -Body $contactBody -Description "Submit Contact Message"

# Test 4: Create Project
$projectBody = @{
    title = "E-Commerce Website"
    description = "A full-stack e-commerce application built with Spring Boot and Angular featuring user authentication, product catalog, shopping cart, and payment integration"
    githubLink = "https://github.com/example/ecommerce"
    imageUrl = "https://example.com/images/ecommerce.png"
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Endpoint "/api/projects" -Body $projectBody -Description "Create New Project"

# Test 5: Get All Projects
Test-Endpoint -Method "GET" -Endpoint "/api/projects" -Description "Get All Projects"

# Test 6: Validation Error Test (Invalid Email)
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Testing Validation" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$invalidContactBody = @{
    name = "Test User"
    email = "invalid-email"
    message = "This should fail validation"
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Endpoint "/api/contact" -Body $invalidContactBody -Description "Test Validation (Invalid Email - Should Fail)"

# Test 7: Validation Error Test (Missing Required Field)
$invalidInternshipBody = @{
    studentName = "Test"
    email = "test@example.com"
    # Missing phone and internshipType
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Endpoint "/api/internships/apply" -Body $invalidInternshipBody -Description "Test Validation (Missing Fields - Should Fail)"

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  - If all tests passed (except validation tests), backend is working correctly" -ForegroundColor White
Write-Host "  - Validation tests should fail with HTTP 400 errors" -ForegroundColor White
Write-Host "  - Check the database to verify data was saved" -ForegroundColor White
Write-Host ""
