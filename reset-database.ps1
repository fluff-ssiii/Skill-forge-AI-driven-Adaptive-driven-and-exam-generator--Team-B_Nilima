# Script to completely reset the users table
# This will DELETE ALL users from the database

Write-Host "=== DATABASE RESET SCRIPT ===" -ForegroundColor Red
Write-Host ""
Write-Host "WARNING: This will DELETE ALL user accounts!" -ForegroundColor Yellow
Write-Host ""

$baseUrl = "http://localhost:8080/api/admin/users"

try {
    # Get all users
    Write-Host "Fetching all users..." -ForegroundColor Cyan
    $users = Invoke-RestMethod -Uri $baseUrl -Method GET
    
    if ($users.Count -eq 0) {
        Write-Host "Database is already empty!" -ForegroundColor Green
        exit
    }
    
    Write-Host "Found $($users.Count) users to delete:" -ForegroundColor Yellow
    foreach ($user in $users) {
        Write-Host "  - ID: $($user.id) | Email: $($user.email)"
    }
    
    Write-Host ""
    Write-Host "Deleting all users..." -ForegroundColor Red
    
    foreach ($user in $users) {
        try {
            Write-Host "Deleting user ID $($user.id) ($($user.email))..." -NoNewline
            $response = Invoke-RestMethod -Uri "$baseUrl/$($user.id)" -Method DELETE -ErrorAction Stop
            if ($response.status -eq "success") {
                Write-Host " ✓ DELETED" -ForegroundColor Green
            } else {
                Write-Host " ✗ FAILED: $($response.message)" -ForegroundColor Red
            }
        } catch {
            Write-Host " ✗ ERROR: $_" -ForegroundColor Red
        }
        Start-Sleep -Milliseconds 300
    }
    
    Write-Host ""
    Write-Host "=== DATABASE RESET COMPLETE ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your database is now empty and ready for fresh registrations!" -ForegroundColor Cyan
    
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure the backend server is running!" -ForegroundColor Yellow
}
