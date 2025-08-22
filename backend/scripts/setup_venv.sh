#!/usr/bin/env bash
set -Eeuo pipefail

# Uso:
#   ./setup_venv.sh [ruta_del_venv] [archivo_requirements]
# Ejemplos:
#   ./setup_venv.sh                 # usa .venv y requirements.txt
#   ./setup_venv.sh .venv dev-requirements.txt

VENV_DIR="${1:-.venv}"
REQ_FILE="${2:-requirements.txt}"

# 1) Detectar Python 3
if command -v python3 >/dev/null 2>&1; then
  PY="python3"
elif command -v python >/dev/null 2>&1; then
  PY="python"
elif command -v py >/dev/null 2>&1; then
  # En Windows con 'py' (Git Bash/WSL), intenta Python 3
  PY="py -3"
else
  echo "❌ No se encontró Python 3 en el PATH." >&2
  echo "   Instálalo y asegúrate de tener 'python3' o 'python' disponible." >&2
  exit 1
fi

echo "➡️  Usando intérprete: $($PY -V)"

# 2) Crear el venv (si no existe)
if [[ ! -d "$VENV_DIR" ]]; then
  echo "🧪 Creando entorno virtual en: $VENV_DIR"
  $PY -m venv "$VENV_DIR"
else
  echo "ℹ️  El entorno virtual ya existe: $VENV_DIR"
fi

# 3) Activar el venv (Linux/macOS: bin/activate, Windows(Git Bash): Scripts/activate)
if [[ -f "$VENV_DIR/bin/activate" ]]; then
  # shellcheck source=/dev/null
  source "$VENV_DIR/bin/activate"
elif [[ -f "$VENV_DIR/Scripts/activate" ]]; then
  # shellcheck source=/dev/null
  source "$VENV_DIR/Scripts/activate"
else
  echo "❌ No se encontró el script de activación del venv." >&2
  echo "   Revisa que '$VENV_DIR' sea un entorno virtual válido." >&2
  exit 1
fi

# 4) Actualizar pip/setuptools/wheel
echo "⬆️  Actualizando pip, setuptools y wheel..."
python -m pip install --upgrade pip setuptools wheel

# 5) Instalar dependencias
if [[ -f "$REQ_FILE" ]]; then
  echo "📦 Instalando dependencias desde: $REQ_FILE"
  pip install -r "$REQ_FILE"
else
  echo "⚠️  No se encontró '$REQ_FILE'. Saltando instalación de dependencias."
fi

echo
echo "✅ Entorno listo."
echo "👉 Para activar después:"
if [[ -f "$VENV_DIR/bin/activate" ]]; then
  echo "   source $VENV_DIR/bin/activate"
else
  echo "   source $VENV_DIR/Scripts/activate"
fi
