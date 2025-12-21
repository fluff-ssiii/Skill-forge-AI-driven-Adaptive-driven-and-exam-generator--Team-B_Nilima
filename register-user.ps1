$body = @{
    fullName = "Test Instructor"
    email = "instructor@gmail.com"
    password = "password123"
    role = "INSTRUCTOR"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8080/auth/register" -Method Post -Body $body -ContentType "application/json"
Write-Host "Registration successful!"
Write-Host "Token: $($response.token)"
Write-Host "Role: $($response.role)"
Write-Host "Email: $($response.email)"
