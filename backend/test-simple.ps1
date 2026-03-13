# Simple test script
$baseUrl = "http://localhost:8081"

Write-Host "Testing login endpoint..." -ForegroundColor Cyan

$body = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -ContentType "application/json" -Body $body
    Write-Host "SUCCESS: Login worked!" -ForegroundColor Green
    Write-Host "Token: $($response.token.Substring(0,20))..." -ForegroundColor Gray
    $token = $response.token
    
    # Test admin endpoint with token
    Write-Host "`nTesting admin courses endpoint..." -ForegroundColor Cyan
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    $courses = Invoke-RestMethod -Uri "$baseUrl/api/admin/courses" -Method GET -Headers $headers
    Write-Host "SUCCESS: Got courses!" -ForegroundColor Green
    $courses | ConvertTo-Json
    
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
