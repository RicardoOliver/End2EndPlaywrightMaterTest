$ErrorActionPreference = 'Stop'
$candidatePaths = @(
  '.\node_modules\allure-commandline\dist\bin\allure.bat',
  '.\node_modules\allure-commandline\bin\allure.bat'
)
$allurePath = $null
foreach ($p in $candidatePaths) {
  if (Test-Path $p) { $allurePath = Resolve-Path $p; break }
}
if (-not $allurePath) { throw "Allure CLI not found under node_modules/allure-commandline" }
Write-Host "Using Allure CLI at: $allurePath"
if (-not (Test-Path '.\allure-results')) { throw "Folder 'allure-results' not found. Run tests first." }
New-Item -ItemType Directory -Force -Path '.\reports\allure' | Out-Null
& $allurePath generate "allure-results" -o "reports\allure" --clean