@echo off
chcp 65001 >nul
echo ========================================
echo   个人主页 - 启动开发服务器
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

REM 显示版本信息
echo [信息] Node.js 版本:
node --version
echo [信息] npm 版本:
npm --version
echo.

REM 检查是否已安装依赖
if not exist "node_modules" (
    echo [信息] 首次运行，正在安装依赖...
    echo 这可能需要几分钟时间，请耐心等待...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
    echo.
    echo [成功] 依赖安装完成！
    echo.
)

REM 启动开发服务器
echo [信息] 正在启动开发服务器...
echo.
echo ========================================
echo   服务器启动后，浏览器会自动打开
echo   如果没有自动打开，请手动访问:
echo   http://localhost:5173
echo ========================================
echo.
echo 按 Ctrl+C 可以停止服务器
echo.
echo 正在启动，请稍候...
echo.

call npm run dev

if %errorlevel% neq 0 (
    echo.
    echo [错误] 服务器启动失败
    echo.
    echo 可能的原因:
    echo 1. 端口被占用 - 尝试关闭其他使用 5173 端口的程序
    echo 2. 依赖未正确安装 - 运行 "安装依赖.bat"
    echo 3. 代码有错误 - 查看上方的错误信息
    echo.
    pause
)
