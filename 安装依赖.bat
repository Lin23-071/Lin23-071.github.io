@echo off
chcp 65001 >nul
echo ========================================
echo   安装项目依赖
echo ========================================
echo.

REM 检查 Node.js 是否安装
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未找到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo [信息] Node.js 版本:
node --version
echo [信息] npm 版本:
npm --version
echo.

echo [信息] 正在安装依赖...
echo 这可能需要几分钟时间，请耐心等待...
echo.

call npm install

if %errorlevel% equ 0 (
    echo.
    echo [成功] 依赖安装完成！
    echo.
    echo 现在可以运行 "启动项目.bat" 来启动开发服务器
) else (
    echo.
    echo [错误] 依赖安装失败
    echo 可以尝试使用国内镜像:
    echo   npm config set registry https://registry.npmmirror.com
    echo   然后重新运行此脚本
)

echo.
pause
