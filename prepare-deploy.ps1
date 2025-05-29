# Create deploy directory if it doesn't exist
$deployDir = "$PSScriptRoot\deploy"
if (Test-Path $deployDir) {
    Remove-Item -Recurse -Force $deployDir
}
New-Item -ItemType Directory -Force -Path $deployDir | Out-Null

# Create a firebase.json file in the deploy directory
$firebaseJson = @"
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
}
"@
$firebaseJson | Out-File -FilePath "$deployDir\firebase.json" -Encoding utf8

# Copy essential files directly from new_public to deploy
Copy-Item -Path "$PSScriptRoot\new_public\*" -Destination "$deployDir" -Recurse -Force

# Copy other necessary files (like .firebaserc if it exists)
if (Test-Path "$PSScriptRoot\.firebaserc") {
    Copy-Item -Path "$PSScriptRoot\.firebaserc" -Destination "$deployDir\.firebaserc" -Force
}

Write-Host "Deployment files prepared in $deployDir" -ForegroundColor Green
