@echo off
REM Recipes of Barista - Android projesini kurar (Windows)
REM Gerekli: Node.js 22+, Android Studio (Otter 2025.2 veya yenisi), JDK 21
cd /d "%~dp0"
echo 1/4  Paketler kuruluyor...
call npm install || goto :err
echo 2/4  Android projesi olusturuluyor...
if not exist android call npx cap add android || goto :err
echo 3/4  Simgeler ve acilis ekrani...
call npm run icons
echo 4/4  Ayarlar uygulaniyor ve esitleniyor...
call npm run sync || goto :err
echo.
echo Bitti! Android Studio'yu acmak icin:  npm run open
pause
exit /b 0
:err
echo HATA olustu. Yukaridaki mesaji kontrol et.
pause
exit /b 1
