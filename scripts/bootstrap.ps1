Param(
    [string]$VenvPath = ".venv"
)

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition | Join-Path -ChildPath ".." | Resolve-Path
Set-Location $projectRoot

if (Test-Path $VenvPath) {
    Write-Host "🔄  $VenvPath already exists – upgrading dependencies..."
} else {
    Write-Host "🐍  Creating virtual environment in $VenvPath"
    python -m venv $VenvPath
}

& "$VenvPath/Scripts/Activate.ps1"
python -m pip install --upgrade pip
pip install -r requirements.txt

Write-Host "`n✅  Environment ready. Activate with:  `"& $VenvPath/Scripts/Activate.ps1`"" 