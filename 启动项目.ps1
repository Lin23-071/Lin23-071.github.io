# PowerShell 启动脚本
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  个人主页 - 启动开发服务器" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js
Write-Host "[信息] 检查 Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[错误] 未找到 Node.js" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}
Write-Host "  Node.js 版本: $nodeVersion" -ForegroundColor Green

# 检查 npm
Write-Host "[信息] 检查 npm..." -ForegroundColor Yellow
$npmVersion = npm --version 2>&1
Write-Host "  npm 版本: $npmVersion" -ForegroundColor Green
Write-Host ""

# 检查依赖
Write-Host "[信息] 检查项目依赖..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "[警告] 依赖未安装，正在安装..." -ForegroundColor Yellow
    Write-Host "  这可能需要几分钟时间，请耐心等待..." -ForegroundColor Gray
    Write-Host ""
    
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[错误] 依赖安装失败" -ForegroundColor Red
        Write-Host "  可以尝试使用国内镜像:" -ForegroundColor Yellow
        Write-Host "  npm config set registry https://registry.npmmirror.com" -ForegroundColor Gray
        Read-Host "按回车键退出"
        exit 1
    }
    Write-Host ""
    Write-Host "[成功] 依赖安装完成！" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[信息] 依赖已安装" -ForegroundColor Green
    Write-Host ""
}

# 检查端口
Write-Host "[信息] 检查端口 5173..." -ForegroundColor Yellow
$portCheck = netstat -ano | Select-String ":5173"
if ($portCheck) {
    Write-Host "[警告] 端口 5173 可能已被占用" -ForegroundColor Yellow
    Write-Host "  如果服务器无法启动，请关闭占用该端口的程序" -ForegroundColor Gray
} else {
    Write-Host "[信息] 端口 5173 可用" -ForegroundColor Green
}
Write-Host ""

# 启动服务器
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  正在启动开发服务器..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "如果看到以下信息，说明启动成功:" -ForegroundColor Yellow
Write-Host "  'VITE v5.0.8  ready in XXX ms'" -ForegroundColor Gray
Write-Host "  'Local:   http://localhost:5173/'" -ForegroundColor Gray
Write-Host ""
Write-Host "按 Ctrl+C 可以停止服务器" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 启动开发服务器
npm run dev

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  服务器已停止" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Read-Host "按回车键退出"
