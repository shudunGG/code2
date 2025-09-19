#!/bin/bash

# 数据库可视化系统部署脚本
# 使用方法: ./deploy.sh [环境] [服务器IP]
# 示例: ./deploy.sh prod 200.10.3.16

set -e  # 遇到错误立即退出

# 配置变量
ENV=${1:-prod}
SERVER_IP=${2:-200.10.3.16}
APP_NAME="ksh"
DEPLOY_PATH="/data/${APP_NAME}"
NGINX_CONF_PATH="/data/bonc/nginx/conf/conf.d"
BACKEND_PORT="10999"
NGINX_PORT="8633"

echo "=== 数据库可视化系统部署脚本 ==="
echo "环境: $ENV"
echo "服务器: $SERVER_IP"
echo "部署路径: $DEPLOY_PATH"
echo ""

# 1. 前端构建
echo "[1/6] 构建前端项目..."
cd frontend
npm install
npm run build
echo "前端构建完成"

# 2. 后端打包
echo "[2/6] 打包后端项目..."
cd ..
mvn clean package -DskipTests
echo "后端打包完成"

# 3. 创建部署目录
echo "[3/6] 创建服务器部署目录..."
ssh root@$SERVER_IP "mkdir -p $DEPLOY_PATH/{dist,backend,logs,scripts}"
ssh root@$SERVER_IP "mkdir -p /var/cache/nginx/api"
ssh root@$SERVER_IP "chown -R nginx:nginx /var/cache/nginx"

# 4. 部署前端文件
echo "[4/6] 部署前端文件..."
scp -r frontend/dist/* root@$SERVER_IP:$DEPLOY_PATH/dist/
echo "前端文件部署完成"

# 5. 部署后端文件
echo "[5/6] 部署后端文件..."
scp target/demo-0.0.1-SNAPSHOT.jar root@$SERVER_IP:$DEPLOY_PATH/backend/app.jar
scp src/main/resources/application.properties root@$SERVER_IP:$DEPLOY_PATH/backend/

# 创建后端启动脚本
cat > backend_start.sh << 'EOF'
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
EOF

scp backend_start.sh root@$SERVER_IP:$DEPLOY_PATH/scripts/
ssh root@$SERVER_IP "chmod +x $DEPLOY_PATH/scripts/backend_start.sh"
rm backend_start.sh

echo "后端文件部署完成"

# 6. 部署nginx配置
echo "[6/6] 部署nginx配置..."

# 检查并添加缓存配置到主nginx配置文件
ssh root@$SERVER_IP "grep -q 'proxy_cache_path.*api_cache' /etc/nginx/nginx.conf || sed -i '/http {/a\    proxy_cache_path /var/cache/nginx/api levels=1:2 keys_zone=api_cache:10m max_size=100m inactive=60m use_temp_path=off;' /etc/nginx/nginx.conf"

# 部署站点配置文件
scp ksh.conf root@$SERVER_IP:$NGINX_CONF_PATH/

# 测试nginx配置
ssh root@$SERVER_IP "nginx -t"

# 重启服务
echo "重启服务..."
ssh root@$SERVER_IP "systemctl restart nginx"
ssh root@$SERVER_IP "$DEPLOY_PATH/scripts/backend_start.sh restart"

echo ""
echo "=== 部署完成 ==="
echo "前端访问地址: http://$SERVER_IP:$NGINX_PORT"
echo "后端API地址: http://$SERVER_IP:$NGINX_PORT/api"
echo ""
echo "管理命令:"
echo "  查看后端状态: ssh root@$SERVER_IP '$DEPLOY_PATH/scripts/backend_start.sh status'"
echo "  重启后端: ssh root@$SERVER_IP '$DEPLOY_PATH/scripts/backend_start.sh restart'"
echo "  查看后端日志: ssh root@$SERVER_IP 'tail -f $DEPLOY_PATH/logs/backend.log'"
echo "  查看nginx日志: ssh root@$SERVER_IP 'tail -f /var/log/nginx/access.log'"
echo ""
echo "性能监控:"
echo "  检查缓存状态: curl -I http://$SERVER_IP:$NGINX_PORT/api/database/interface-resources"
echo "  查看响应时间: curl -w '@-' -o /dev/null -s http://$SERVER_IP:$NGINX_PORT/api/database/interface-resources <<< 'time_total: %{time_total}s'"