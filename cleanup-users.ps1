# Script to delete duplicate user accounts
# This will delete user IDs: 2, 3, 4, 6 (duplicates)
# Keeping: ID 1 (instructor@gmail.com) and ID 5 (testinstructor@example.com)

Write-Host "Deleting duplicate user accounts..." -ForegroundColor Yellow
Write-Host ""

$baseUrl = "http://localhost:8080/api/admin/users"
$duplicateIds = @(2, 3, 4, 6)

foreach ($id in $duplicateIds) {
    try {
        Write-Host "Deleting user ID $id..." -NoNewline
        $response = Invoke-RestMethod -Uri "$baseUrl/$id" -Method DELETE -ErrorAction Stop
        if ($response.status -eq "success") {
            Write-Host " SUCCESS" -ForegroundColor Green
        } else {
            Write-Host " FAILED: $($response.message)" -ForegroundColor Red
        }
    } catch {
        Write-Host " ERROR: $_" -ForegroundColor Red
    }
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "Cleanup complete! Fetching remaining users..." -ForegroundColor Green
Write-Host ""

try {
    $users = Invoke-RestMethod -Uri $baseUrl -Method GET
    Write-Host "=== Remaining Users ===" -ForegroundColor Cyan
    foreach ($user in $users) {
        Write-Host "ID: $($user.id) | Email: $($user.email) | Name: $($user.fullName) | Role: $($user.role)"
    }
    Write-Host ""
    Write-Host "Total users: $($users.Count)" -ForegroundColor Green
} catch {
    Write-Host "Could not fetch users: $_" -ForegroundColor Red
}
