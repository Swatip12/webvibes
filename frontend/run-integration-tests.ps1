# PowerShell script to run integration tests
# Task 26.3: Test complete user flows

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "WebVibes Technology - Integration Tests" -ForegroundColor Cyan
Write-Host "Task 26.3: Complete User Flows" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Running integration tests..." -ForegroundColor Green
Write-Host ""

# Run tests
ng test --include='**/user-flows.spec.ts' --watch=false --browsers=ChromeHeadless

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "All integration tests passed!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Test Coverage:" -ForegroundColor Cyan
    Write-Host "  ✓ Navigation between all pages" -ForegroundColor Green
    Write-Host "  ✓ Internship application submission" -ForegroundColor Green
    Write-Host "  ✓ Course enrollment submission" -ForegroundColor Green
    Write-Host "  ✓ Contact form submission" -ForegroundColor Green
    Write-Host "  ✓ Project display from database" -ForegroundColor Green
    Write-Host "  ✓ Complete user journey" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "Some tests failed!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please review the test output above for details." -ForegroundColor Yellow
    Write-Host "See INTEGRATION_TEST_GUIDE.md for troubleshooting." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
