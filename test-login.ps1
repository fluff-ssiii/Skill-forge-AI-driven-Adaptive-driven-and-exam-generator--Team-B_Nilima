$body = @{
    email = "instructor@gmail.com"
    password = "password123"
} | ConvertTo-Json

Write-Host "Testing login with credentials..."
Write-Host "Email: instructor@gmail.com"
Write-Host "Password: password123"
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/auth/authenticate" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host "Token: $($response.token)"
    Write-Host "Role: $($response.role)"
    Write-Host "Email: $($response.email)"
    Write-Host "User ID: $($response.userId)"
} catch {
    Write-Host "✗ Login failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $responseBody = $reader.ReadToEnd()
    Write-Host "Response: $responseBody"
}
