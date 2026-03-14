# Restart Frontend Script
Write-Host "🔄 Restarting Angular Frontend..." -ForegroundColor Cyan

# Navigate to frontend directory
Set-Location frontend

# Clear Angular cache
Write-Host "🗑️  Clearing Angular cache..." -ForegroundColor Yellow
if (Test-Path ".angular/cache") {
    Remove-Item -Recurse -Force ".angular/cache"
    Write-Host "✅ Cache cleared!" -ForegroundColor Green
}

# Start the development server
Write-Host "🚀 Starting development server..." -ForegroundColor Cyan
Write-Host "📝 Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "🌐 Open http://localhost:4200 in your browser" -ForegroundColor Green
Write-Host "💡 Use Ctrl+Shift+R or Ctrl+F5 for hard refresh" -ForegroundColor Magenta
Write-Host ""

ng serve
