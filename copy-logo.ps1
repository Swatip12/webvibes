# PowerShell script to copy logo to assets folder

$sourcePath = "C:\Users\swatip\OneDrive\Desktop\logo.png"
$destinationPath = "frontend\src\assets\logo.png"

# Check if source file exists
if (Test-Path $sourcePath) {
    # Create assets directory if it doesn't exist
    $assetsDir = Split-Path $destinationPath -Parent
    if (-not (Test-Path $assetsDir)) {
        New-Item -ItemType Directory -Path $assetsDir -Force | Out-Null
        Write-Host "Created assets directory: $assetsDir" -ForegroundColor Green
    }
    
    # Copy the file
    Copy-Item -Path $sourcePath -Destination $destinationPath -Force
    Write-Host "Logo copied successfully to: $destinationPath" -ForegroundColor Green
    Write-Host "Your navigation will now display the WebVibes Technologies logo!" -ForegroundColor Cyan
} else {
    Write-Host "Error: Source file not found at: $sourcePath" -ForegroundColor Red
    Write-Host "Please verify the file path and try again." -ForegroundColor Yellow
}
