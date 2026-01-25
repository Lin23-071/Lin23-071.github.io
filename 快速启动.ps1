# 快速启动脚本（简化版）
Write-Host "正在启动开发服务器..." -ForegroundColor Cyan
Write-Host ""

# 检查并安装依赖
if (-not (Test-Path "node_modules")) {
    Write-Host "首次运行，正在安装依赖..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "依赖安装失败！" -ForegroundColor Red
        exit 1
    }
}

# 启动服务器
Write-Host "启动服务器..." -ForegroundColor Green
Write-Host ""
npm run dev
