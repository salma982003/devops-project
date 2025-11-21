@echo off
setlocal enabledelayedexpansion

set URL=%1
if "%URL%"=="" set URL=http://localhost:3000
set MAX_TRIES=15
set SLEEP=2

echo 🧪 Smoke test starting for: %URL%

for /l %%i in (1,1,%MAX_TRIES%) do (
  curl -fs "%URL%" > nul 2>&1
  if !errorlevel! equ 0 (
    echo ✅ SMOKE_TEST_PASSED: %URL% accessible
    exit /b 0
  )
  echo ⏳ Attempt %%i/%MAX_TRIES% - Waiting %SLEEP% seconds...
  timeout /t %SLEEP% /nobreak > nul
)

echo ❌ SMOKE_TEST_FAILED: %URL% not accessible after %MAX_TRIES% attempts
exit /b 1