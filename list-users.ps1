# Query all users from the database
$connectionString = "server=localhost;port=3306;database=springpro_db;user=root;password=anumnlogin@18"

try {
    # Load MySQL .NET Connector
    Add-Type -Path "C:\Program Files (x86)\MySQL\MySQL Connector NET 8.0.23\Assemblies\v4.5.2\MySql.Data.dll" -ErrorAction SilentlyContinue
    
    $connection = New-Object MySql.Data.MySqlClient.MySqlConnection($connectionString)
    $connection.Open()
    
    $command = $connection.CreateCommand()
    $command.CommandText = "SELECT id, fullName, email, role FROM users"
    
    $reader = $command.ExecuteReader()
    
    Write-Host "`n=== All Registered Users ===" -ForegroundColor Green
    Write-Host ""
    
    $userCount = 0
    while ($reader.Read()) {
        $userCount++
        Write-Host "User $userCount:" -ForegroundColor Yellow
        Write-Host "  ID: $($reader['id'])"
        Write-Host "  Name: $($reader['fullName'])"
        Write-Host "  Email: $($reader['email'])" -ForegroundColor Cyan
        Write-Host "  Role: $($reader['role'])" -ForegroundColor Magenta
        Write-Host ""
    }
    
    if ($userCount -eq 0) {
        Write-Host "No users found in database." -ForegroundColor Red
    } else {
        Write-Host "Total users: $userCount" -ForegroundColor Green
    }
    
    $reader.Close()
    $connection.Close()
} catch {
    Write-Host "Error connecting to database: $_" -ForegroundColor Red
    Write-Host "`nTrying alternative method via backend API..." -ForegroundColor Yellow
}
