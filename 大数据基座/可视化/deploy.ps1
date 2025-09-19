# 数据库可视化系统部署脚本 (Windows PowerShell版本)
# 使用方法: .\deploy.ps1 -Environment prod -ServerIP 200.10.3.16
# 示例: .\deploy.ps1 -Environment prod -ServerIP 200.10.3.16

param(
    [string]$Environment = "prod",
    [string]$ServerIP = "200.10.3.16",
    [string]$AppName = "ksh",
    [string]$DeployPath = "/data/ksh",
    [string]$NginxConfPath = "/data/bonc/nginx/conf/conf.d",
    [string]$BackendPort = "10999",
    [string]$NginxPort = "8633"
)

$ErrorActionPreference = "Stop"

Write-Host "=== 数据库可视化系统部署脚本 ===" -ForegroundColor Green
Write-Host "环境: $Environment" -ForegroundColor Yellow
Write-Host "服务器: $ServerIP" -ForegroundColor Yellow
Write-Host "部署路径: $DeployPath" -ForegroundColor Yellow
Write-Host ""

try {
    # 1. 前端构建
    Write-Host "[1/6] 构建前端项目..." -ForegroundColor Cyan
    Set-Location frontend
    npm install
    npm run build
    Write-Host "前端构建完成" -ForegroundColor Green
    Set-Location ..

    # 2. 后端打包
    Write-Host "[2/6] 打包后端项目..." -ForegroundColor Cyan
    mvn clean package -DskipTests
    Write-Host "后端打包完成" -ForegroundColor Green

    # 3. 创建部署目录（需要SSH工具）
    Write-Host "[3/6] 创建服务器部署目录..." -ForegroundColor Cyan
    Write-Host "请在服务器上手动执行以下命令：" -ForegroundColor Yellow
    Write-Host "mkdir -p $DeployPath/{dist,backend,logs,scripts}" -ForegroundColor White
    Write-Host "mkdir -p /var/cache/nginx/api" -ForegroundColor White
    Write-Host "chown -R nginx:nginx /var/cache/nginx" -ForegroundColor White
    Read-Host "完成后按回车继续"

    # 4. 部署前端文件（需要SCP工具）
    Write-Host "[4/6] 准备前端部署文件..." -ForegroundColor Cyan
    if (Test-Path "deploy_temp") {
        Remove-Item "deploy_temp" -Recurse -Force
    }
    New-Item -ItemType Directory -Path "deploy_temp\frontend" -Force | Out-Null
    Copy-Item "frontend\dist\*" "deploy_temp\frontend\" -Recurse -Force
    Write-Host "前端文件已准备完成，请使用SCP工具上传 deploy_temp/frontend/ 到服务器 $DeployPath/dist/" -ForegroundColor Yellow

    # 5. 部署后端文件
    Write-Host "[5/6] 准备后端部署文件..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path "deploy_temp\backend" -Force | Out-Null
    Copy-Item "target\demo-0.0.1-SNAPSHOT.jar" "deploy_temp\backend\app.jar" -Force
    Copy-Item "src\main\resources\application.properties" "deploy_temp\backend\" -Force

    # 创建后端启动脚本
    $backendScript = @'
#!/bin/bash
APP_PATH="/data/ksh/backend"
JAR_FILE="$APP_PATH/app.jar"
PID_FILE="$APP_PATH/app.pid"
LOG_FILE="/data/ksh/logs/backend.log"

start() {
    if [ -f $PID_FILE ] && kill -0 $(cat $PID_FILE) 2>/dev/null; then
        echo "后端服务已在运行中"
        return 1
    fi
    
    echo "启动后端服务..."
    nohup java -jar $JAR_FILE --spring.config.location=$APP_PATH/application.properties > $LOG_FILE 2>&1 &
    echo $! > $PID_FILE
    echo "后端服务已启动，PID: $(cat $PID_FILE)"
}

stop() {
    if [ ! -f $PID_FILE ]; then
        echo "后端服务未运行"
        return 1
    fi
    
    PID=$(cat $PID_FILE)
    if kill -0 $PID 2>/dev/null; then
        echo "停止后端服务..."
        kill $PID
        rm -f $PID_FILE
        echo "后端服务已停止"
    else
        echo "后端服务未运行"
        rm -f $PID_FILE
    fi
}

restart() {
    stop
    sleep 2
    start
}

status() {
    if [ -f $PID_FILE ] && kill -0 $(cat $PID_FILE) 2>/dev/null; then
        echo "后端服务运行中，PID: $(cat $PID_FILE)"
    else
        echo "后端服务未运行"
    fi
}

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    status)
        status
        ;;
    *)
        echo "使用方法: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac
'@

    New-Item -ItemType Directory -Path "deploy_temp\scripts" -Force | Out-Null
    $backendScript | Out-File "deploy_temp\scripts\backend_start.sh" -Encoding UTF8
    
    Write-Host "后端文件已准备完成，请使用SCP工具上传：" -ForegroundColor Yellow
    Write-Host "  deploy_temp/backend/ -> $DeployPath/backend/" -ForegroundColor White
    Write-Host "  deploy_temp/scripts/ -> $DeployPath/scripts/" -ForegroundColor White
    Write-Host "并在服务器上执行: chmod +x $DeployPath/scripts/backend_start.sh" -ForegroundColor White

    # 6. 准备nginx配置
    Write-Host "[6/6] 准备nginx配置..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path "deploy_temp\nginx" -Force | Out-Null
    Copy-Item "ksh.conf" "deploy_temp\nginx\" -Force
    
    Write-Host "nginx配置文件已准备完成，请：" -ForegroundColor Yellow
    Write-Host "1. 上传 deploy_temp/nginx/ksh.conf 到服务器 $NginxConfPath/" -ForegroundColor White
    Write-Host "2. 在服务器的 /etc/nginx/nginx.conf 的 http 块中添加：" -ForegroundColor White
    Write-Host "   proxy_cache_path /var/cache/nginx/api levels=1:2 keys_zone=api_cache:10m max_size=100m inactive=60m use_temp_path=off;" -ForegroundColor Gray
    Write-Host "3. 执行 nginx -t 测试配置" -ForegroundColor White
    Write-Host "4. 执行 systemctl restart nginx 重启nginx" -ForegroundColor White
    Write-Host "5. 执行 $DeployPath/scripts/backend_start.sh restart 重启后端" -ForegroundColor White

    Write-Host ""
    Write-Host "=== 部署文件准备完成 ===" -ForegroundColor Green
    Write-Host "所有部署文件已准备在 deploy_temp 目录中" -ForegroundColor Yellow
    Write-Host "前端访问地址: http://$ServerIP`:$NginxPort" -ForegroundColor Cyan
    Write-Host "后端API地址: http://$ServerIP`:$NginxPort/api" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "管理命令:" -ForegroundColor Yellow
    Write-Host "  查看后端状态: $DeployPath/scripts/backend_start.sh status" -ForegroundColor White
    Write-Host "  重启后端: $DeployPath/scripts/backend_start.sh restart" -ForegroundColor White
    Write-Host "  查看后端日志: tail -f $DeployPath/logs/backend.log" -ForegroundColor White
    Write-Host "  查看nginx日志: tail -f /var/log/nginx/access.log" -ForegroundColor White
    Write-Host ""
    Write-Host "性能监控:" -ForegroundColor Yellow
    Write-Host "  检查缓存状态: curl -I http://$ServerIP`:$NginxPort/api/database/interface-resources" -ForegroundColor White
    Write-Host "  查看响应时间: curl -w 'time_total: %{time_total}s' -o /dev/null -s http://$ServerIP`:$NginxPort/api/database/interface-resources" -ForegroundColor White

} catch {
    Write-Host "部署过程中发生错误: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}