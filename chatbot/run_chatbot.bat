@echo off
echo ===================================================
echo     Starting Barq-e-Insaf AI Chatbot Backend
echo ===================================================
echo.

cd /d "%~dp0"

:: Check virtualenv
if not exist venv\Scripts\activate.bat (
    echo Error: Virtual environment 'venv' not found in this directory.
    echo Please create one or make sure you are running this from the right folder.
    pause
    exit /b
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Checking and installing required packages...
python -m pip install flask pypdf sentence-transformers chromadb groq python-dotenv

echo.
echo Starting Flask App on http://127.0.0.1:5000
echo Open http://127.0.0.1:5000 in your browser to interact with the chatbot dashboard!
echo.
echo Press Ctrl+C to stop the server.
echo.

python main.py
pause
