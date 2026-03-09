# System Verification Script - Task 27
# This script performs quick checks to verify the system is complete

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "WebVibes Technology Website" -ForegroundColor Cyan
Write-Host "Final System Verification - Task 27" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allChecks = @()

# Function to add check result
function Add-Check {
    param($name, $status, $details)
    $script:allChecks += [PSCustomObject]@{
        Name = $name
        Status = $status
        Details = $details
    }
}

# Check 1: Backend files exist
Write-Host "Checking backend files..." -ForegroundColor Yellow
$backendFiles = @(
    "backend/src/main/java/com/webvibes/WebVibesApplication.java",
    "backend/src/main/java/com/webvibes/controller/ContactController.java",
    "backend/src/main/java/com/webvibes/controller/CourseController.java",
    "backend/src/main/java/com/webvibes/controller/InternshipController.java",
    "backend/src/main/java/com/webvibes/controller/ProjectController.java",
    "backend/src/main/java/com/webvibes/service/ContactService.java",
    "backend/src/main/java/com/webvibes/service/CourseService.java",
    "backend/src/main/java/com/webvibes/service/InternshipService.java",
    "backend/src/main/java/com/webvibes/service/ProjectService.java",
    "backend/src/main/java/com/webvibes/entity/ContactMessage.java",
    "backend/src/main/java/com/webvibes/entity/CourseEnrollment.java",
    "backend/src/main/java/com/webvibes/entity/InternshipApplication.java",
    "backend/src/main/java/com/webvibes/entity/Project.java",
    "backend/src/main/java/com/webvibes/config/CorsConfig.java",
    "backend/src/main/java/com/webvibes/exception/GlobalExceptionHandler.java",
    "backend/src/main/resources/application.properties",
    "backend/pom.xml"
)

$backendMissing = @()
foreach ($file in $backendFiles) {
    if (-not (Test-Path $file)) {
        $backendMissing += $file
    }
}

if ($backendMissing.Count -eq 0) {
    Write-Host "✓ All backend files present ($($backendFiles.Count) files)" -ForegroundColor Green
    Add-Check "Backend Files" "✓" "All $($backendFiles.Count) files present"
} else {
    Write-Host "✗ Missing backend files: $($backendMissing.Count)" -ForegroundColor Red
    Add-Check "Backend Files" "✗" "Missing $($backendMissing.Count) files"
}

# Check 2: Frontend files exist
Write-Host "Checking frontend files..." -ForegroundColor Yellow
$frontendFiles = @(
    "frontend/src/app/app.module.ts",
    "frontend/src/app/app-routing.module.ts",
    "frontend/src/app/components/home/home.component.ts",
    "frontend/src/app/components/about/about.component.ts",
    "frontend/src/app/components/internship/internship.component.ts",
    "frontend/src/app/components/courses/courses.component.ts",
    "frontend/src/app/components/projects/projects.component.ts",
    "frontend/src/app/components/contact/contact.component.ts",
    "frontend/src/app/components/navigation/navigation.component.ts",
    "frontend/src/app/components/footer/footer.component.ts",
    "frontend/src/app/services/internship.service.ts",
    "frontend/src/app/services/course.service.ts",
    "frontend/src/app/services/contact.service.ts",
    "frontend/src/app/services/project.service.ts",
    "frontend/src/app/interceptors/error.interceptor.ts",
    "frontend/package.json",
    "frontend/angular.json"
)

$frontendMissing = @()
foreach ($file in $frontendFiles) {
    if (-not (Test-Path $file)) {
        $frontendMissing += $file
    }
}

if ($frontendMissing.Count -eq 0) {
    Write-Host "✓ All frontend files present ($($frontendFiles.Count) files)" -ForegroundColor Green
    Add-Check "Frontend Files" "✓" "All $($frontendFiles.Count) files present"
} else {
    Write-Host "✗ Missing frontend files: $($frontendMissing.Count)" -ForegroundColor Red
    Add-Check "Frontend Files" "✗" "Missing $($frontendMissing.Count) files"
}

# Check 3: Integration tests exist
Write-Host "Checking integration tests..." -ForegroundColor Yellow
if (Test-Path "frontend/src/app/integration/user-flows.spec.ts") {
    Write-Host "✓ Integration tests present" -ForegroundColor Green
    Add-Check "Integration Tests" "✓" "user-flows.spec.ts exists"
} else {
    Write-Host "✗ Integration tests missing" -ForegroundColor Red
    Add-Check "Integration Tests" "✗" "user-flows.spec.ts not found"
}

# Check 4: Documentation exists
Write-Host "Checking documentation..." -ForegroundColor Yellow
$docFiles = @(
    "backend/README.md",
    "backend/VERIFICATION_REPORT.md",
    "frontend/README.md",
    "frontend/INTEGRATION_TEST_GUIDE.md",
    "TASK_26.3_COMPLETION_REPORT.md",
    "MANUAL_TESTING_CHECKLIST.md",
    "FINAL_SYSTEM_VERIFICATION.md"
)

$docMissing = @()
foreach ($file in $docFiles) {
    if (-not (Test-Path $file)) {
        $docMissing += $file
    }
}

if ($docMissing.Count -eq 0) {
    Write-Host "✓ All documentation present ($($docFiles.Count) files)" -ForegroundColor Green
    Add-Check "Documentation" "✓" "All $($docFiles.Count) files present"
} else {
    Write-Host "✗ Missing documentation: $($docMissing.Count)" -ForegroundColor Red
    Add-Check "Documentation" "✗" "Missing $($docMissing.Count) files"
}

# Check 5: Spec files exist
Write-Host "Checking spec files..." -ForegroundColor Yellow
$specFiles = @(
    ".kiro/specs/webvibes-technology-website/requirements.md",
    ".kiro/specs/webvibes-technology-website/design.md",
    ".kiro/specs/webvibes-technology-website/tasks.md"
)

$specMissing = @()
foreach ($file in $specFiles) {
    if (-not (Test-Path $file)) {
        $specMissing += $file
    }
}

if ($specMissing.Count -eq 0) {
    Write-Host "✓ All spec files present" -ForegroundColor Green
    Add-Check "Spec Files" "✓" "All 3 files present"
} else {
    Write-Host "✗ Missing spec files: $($specMissing.Count)" -ForegroundColor Red
    Add-Check "Spec Files" "✗" "Missing $($specMissing.Count) files"
}

# Check 6: Backend configuration
Write-Host "Checking backend configuration..." -ForegroundColor Yellow
if (Test-Path "backend/src/main/resources/application.properties") {
    $appProps = Get-Content "backend/src/main/resources/application.properties" -Raw
    $hasDbUrl = $appProps -match "spring.datasource.url"
    $hasCors = Test-Path "backend/src/main/java/com/webvibes/config/CorsConfig.java"
    
    if ($hasDbUrl -and $hasCors) {
        Write-Host "✓ Backend configuration complete" -ForegroundColor Green
        Add-Check "Backend Config" "✓" "Database and CORS configured"
    } else {
        Write-Host "✗ Backend configuration incomplete" -ForegroundColor Red
        Add-Check "Backend Config" "✗" "Missing configuration"
    }
} else {
    Write-Host "✗ application.properties not found" -ForegroundColor Red
    Add-Check "Backend Config" "✗" "application.properties missing"
}

# Check 7: Frontend configuration
Write-Host "Checking frontend configuration..." -ForegroundColor Yellow
if (Test-Path "frontend/src/environments/environment.ts") {
    Write-Host "✓ Frontend environment configured" -ForegroundColor Green
    Add-Check "Frontend Config" "✓" "Environment files present"
} else {
    Write-Host "✗ Frontend environment not configured" -ForegroundColor Red
    Add-Check "Frontend Config" "✗" "Environment files missing"
}

# Check 8: Count components
Write-Host "Counting components..." -ForegroundColor Yellow
$componentDirs = Get-ChildItem "frontend/src/app/components" -Directory -ErrorAction SilentlyContinue
if ($componentDirs) {
    $componentCount = $componentDirs.Count
    Write-Host "✓ Found $componentCount components" -ForegroundColor Green
    Add-Check "Components" "✓" "$componentCount components found"
} else {
    Write-Host "✗ No components found" -ForegroundColor Red
    Add-Check "Components" "✗" "Components directory missing"
}

# Check 9: Count services
Write-Host "Counting services..." -ForegroundColor Yellow
$serviceFiles = Get-ChildItem "frontend/src/app/services/*.service.ts" -ErrorAction SilentlyContinue
if ($serviceFiles) {
    $serviceCount = $serviceFiles.Count
    Write-Host "✓ Found $serviceCount services" -ForegroundColor Green
    Add-Check "Services" "✓" "$serviceCount services found"
} else {
    Write-Host "✗ No services found" -ForegroundColor Red
    Add-Check "Services" "✗" "Services directory missing"
}

# Check 10: Count controllers
Write-Host "Counting controllers..." -ForegroundColor Yellow
$controllerFiles = Get-ChildItem "backend/src/main/java/com/webvibes/controller/*Controller.java" -ErrorAction SilentlyContinue
if ($controllerFiles) {
    $controllerCount = $controllerFiles.Count
    Write-Host "✓ Found $controllerCount controllers" -ForegroundColor Green
    Add-Check "Controllers" "✓" "$controllerCount controllers found"
} else {
    Write-Host "✗ No controllers found" -ForegroundColor Red
    Add-Check "Controllers" "✗" "Controllers directory missing"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verification Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Display summary table
$allChecks | Format-Table -AutoSize

# Calculate pass rate
$passed = ($allChecks | Where-Object { $_.Status -eq "✓" }).Count
$total = $allChecks.Count
$passRate = [math]::Round(($passed / $total) * 100, 1)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Results: $passed/$total checks passed ($passRate%)" -ForegroundColor $(if ($passRate -eq 100) { "Green" } elseif ($passRate -ge 80) { "Yellow" } else { "Red" })
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($passRate -eq 100) {
    Write-Host "✓ System verification PASSED" -ForegroundColor Green
    Write-Host "  All components are present and configured correctly." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "  1. Start MySQL database on localhost:3306" -ForegroundColor White
    Write-Host "  2. Run backend: cd backend && mvn spring-boot:run" -ForegroundColor White
    Write-Host "  3. Run frontend: cd frontend && npm start" -ForegroundColor White
    Write-Host "  4. Open browser to http://localhost:4200" -ForegroundColor White
    Write-Host "  5. Run integration tests: cd frontend && npm test" -ForegroundColor White
    Write-Host "  6. Follow manual testing checklist in MANUAL_TESTING_CHECKLIST.md" -ForegroundColor White
} else {
    Write-Host "✗ System verification FAILED" -ForegroundColor Red
    Write-Host "  Some components are missing or not configured correctly." -ForegroundColor Red
    Write-Host "  Review the failed checks above and ensure all files are present." -ForegroundColor Red
}

Write-Host ""
Write-Host "For detailed verification information, see:" -ForegroundColor Cyan
Write-Host "  - FINAL_SYSTEM_VERIFICATION.md (complete system report)" -ForegroundColor White
Write-Host "  - backend/VERIFICATION_REPORT.md (backend details)" -ForegroundColor White
Write-Host "  - TASK_26.3_COMPLETION_REPORT.md (integration test details)" -ForegroundColor White
Write-Host "  - MANUAL_TESTING_CHECKLIST.md (manual testing procedures)" -ForegroundColor White
Write-Host ""
