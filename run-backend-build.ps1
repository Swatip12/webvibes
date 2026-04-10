$ErrorActionPreference = "Stop"

$mavenVersion = "3.9.6"
$mavenDir = "$env:TEMP\apache-maven-$mavenVersion"
$mavenBin = "$mavenDir\bin\mvn.cmd"

# Download Maven if not present
if (-not (Test-Path $mavenBin)) {
    Write-Host "Downloading Maven $mavenVersion..." -ForegroundColor Yellow
    $mavenUrl = "https://archive.apache.org/dist/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
    $zipFile = "$env:TEMP\maven.zip"
    try {
        Invoke-WebRequest -Uri $mavenUrl -OutFile $zipFile -UseBasicParsing
        Expand-Archive -Path $zipFile -DestinationPath $env:TEMP -Force
        Remove-Item $zipFile
        Write-Host "Maven downloaded." -ForegroundColor Green
    } catch {
        Write-Host "Failed to download Maven: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

$backendPath = Split-Path -Parent $PSCommandPath
$backendPath = Join-Path $backendPath "backend"

Write-Host "=== Running mvn compile ===" -ForegroundColor Cyan
Push-Location $backendPath
try {
    & $mavenBin compile 2>&1
    $compileExit = $LASTEXITCODE
    Write-Host "Compile exit code: $compileExit"
} finally {
    Pop-Location
}

if ($compileExit -ne 0) {
    Write-Host "COMPILATION FAILED" -ForegroundColor Red
    exit $compileExit
}

Write-Host ""
Write-Host "=== Running mvn test ===" -ForegroundColor Cyan
Push-Location $backendPath
try {
    & $mavenBin test 2>&1
    $testExit = $LASTEXITCODE
    Write-Host "Test exit code: $testExit"
} finally {
    Pop-Location
}

if ($testExit -ne 0) {
    Write-Host "TESTS FAILED" -ForegroundColor Red
    exit $testExit
} else {
    Write-Host "ALL TESTS PASSED" -ForegroundColor Green
}
