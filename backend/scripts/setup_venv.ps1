Param(
  [string]$VenvDir = ".venv",
  [string]$Requirements = "requirements.txt"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function Resolve-Python {
  if (Get-Command py -ErrorAction SilentlyContinue) { return @{ cmd = "py"; args = @("-3") } }
  elseif (Get-Command python -ErrorAction SilentlyContinue) { return @{ cmd = "python"; args = @() } }
  elseif (Get-Command python3 -ErrorAction SilentlyContinue) { return @{ cmd = "python3"; args = @() } }
  else { throw "No se encontró Python 3 en el PATH. Instálalo o agrega python/py al PATH." }
}

$py = Resolve-Python

Write-Host "➡️  Intérprete detectado:"
if ($py.cmd -eq "py") { & py -3 -V } else { & $py.cmd -V }

# 1) Crear venv si no existe
if (-not (Test-Path $VenvDir)) {
  Write-Host "🧪 Creando entorno virtual en: $VenvDir"
  if ($py.cmd -eq "py") { & py -3 -m venv $VenvDir } else { & $py.cmd -m venv $VenvDir }
} else {
  Write-Host "ℹ️  El entorno virtual ya existe: $VenvDir"
}

# 2) Usar el Python del venv (sin necesidad de activar)
$venvPython = Join-Path $VenvDir "Scripts\python.exe"
if (-not (Test-Path $venvPython)) {
  throw "No se encontró $venvPython. ¿Se creó correctamente el venv?"
}

# 3) Actualizar herramientas básicas
Write-Host "⬆️  Actualizando pip, setuptools y wheel..."
& $venvPython -m pip install --upgrade pip setuptools wheel

# 4) Instalar dependencias
if (Test-Path $Requirements) {
  Write-Host "📦 Instalando dependencias desde: $Requirements"
  & $venvPython -m pip install -r $Requirements
} else {
  Write-Warning "No se encontró '$Requirements'. Se omite instalación de dependencias."
}

Write-Host ""
Write-Host "✅ Entorno listo."
Write-Host "👉 Para activar en esta terminal (PowerShell):"
Write-Host "   & `"$((Join-Path $VenvDir 'Scripts\Activate.ps1'))`""
