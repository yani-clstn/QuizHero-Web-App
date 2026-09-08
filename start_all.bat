@echo off
echo Starting Quiz Hero Backend and Frontend...
start "Quiz Hero Backend" cmd /k ""%~dp0start_backend.bat""
start "Quiz Hero Frontend" cmd /k ""%~dp0start_frontend.bat""
echo Both servers started!

