$body = @{
    name = "Test"
    phone = "1234567890"
}
$json = $body | ConvertTo-Json -Compress
Invoke-WebRequest -Uri "http://localhost:3000/api/leads" -Method POST -ContentType "application/json" -Body $json -UseBasicParsing
