# Auto-download Maven and build backend
Write-Host "Building backend with auto-downloaded Maven..." -ForegroundColor Cyan

$mavenVersion = "3.9.6"
$mavenUrl = "https://dlcdn.apache.org/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
$mavenDir = "$env:TEMP\apache-maven-$mavenVersion"
$mavenBin = "$mavenDir\bin\mvn.cmd"

# Check if Maven is already downloaded
if (-not (Test-Path $mavenBin)) {
    Write-Host "Downloading Maven $mavenVersion..." -ForegroundColor Yellow
    $zipFile = "$env:TEMP\maven.zip"
    
    try {
        Invoke-WebRequest -Uri $mavenUrl -OutFile $zipFile -UseBasicParsing
        Write-Host "Extracting Maven..." -ForegroundColor Yellow
        Expand-Archive -Path $zipFile -DestinationPath $env:TEMP -Force
        Remove-Item $zipFile
        Write-Host "✓ Maven downloaded successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Failed to download Maven: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Build the backend
Write-Host "Building backend..." -ForegroundColor Yellow
Push-Location backend

try {
    & $mavenBin clean package -DskipTests
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✓ Build successful!" -ForegroundColor Green
        Write-Host "JAR file created at: backend\target\webvibes-backend-1.0.0.jar" -ForegroundColor Green
        Write-Host "`nTo start the backend, run:" -ForegroundColor Cyan
        Write-Host "  cd backend" -ForegroundColor White
        Write-Host "  java -jar target\webvibes-backend-1.0.0.jar --spring.config.location=file:./application.properties" -ForegroundColor White
    }
    else {
        Write-Host "`n✗ Build failed with exit code $LASTEXITCODE" -ForegroundColor Red
    }
}
catch {
    Write-Host "✗ Build error: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    Pop-Location
}
