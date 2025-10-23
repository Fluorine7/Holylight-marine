# 好利来贸易网站部署文档

## 项目概述

这是一个基于 React + Node.js + MySQL 的全栈网站，包含前台展示和后台管理系统。

## 技术栈

- **前端**: React 19, Tailwind CSS 4, shadcn/ui
- **后端**: Node.js, Express, tRPC
- **数据库**: MySQL/PostgreSQL
- **认证**: Manus OAuth（可选，用于管理员登录）

## 服务器要求

### 最低配置
- CPU: 2核心
- 内存: 4GB
- 存储: 40GB SSD
- 带宽: 5Mbps
- 操作系统: Ubuntu 20.04 / CentOS 7+

### 推荐云服务商
- 阿里云
- 腾讯云
- 华为云

## 宝塔面板部署步骤

### 1. 安装宝塔面板

#### Ubuntu/Debian 系统
```bash
wget -O install.sh https://download.bt.cn/install/install-ubuntu_6.0.sh
sudo bash install.sh
```

#### CentOS 系统
```bash
yum install -y wget
wget -O install.sh https://download.bt.cn/install/install_6.0.sh
sh install.sh
```

安装完成后，记录显示的面板地址、用户名和密码。

### 2. 登录宝塔面板并安装软件

访问宝塔面板地址，使用提供的用户名和密码登录。

在**软件商店**中安装以下软件：

1. **Nginx** (推荐 1.22+)
2. **MySQL** (推荐 8.0+) 或 **PostgreSQL**
3. **Node.js 版本管理器** (安装 Node.js 18+)
4. **PM2 管理器** (用于管理 Node.js 进程)

### 3. 创建数据库

1. 进入宝塔面板 → **数据库**
2. 点击**添加数据库**
3. 填写信息：
   - 数据库名: `holylight_marine`
   - 用户名: `holylight_user`
   - 密码: 设置一个强密码（记录下来）
   - 访问权限: 本地服务器
4. 点击**提交**

### 4. 上传项目文件

1. 在宝塔面板 → **文件**
2. 进入 `/www/wwwroot/` 目录
3. 创建新文件夹 `holylight-marine`
4. 将项目文件上传到该目录（可以使用 FTP 或宝塔的文件上传功能）

**或者使用 Git 克隆（推荐）：**

```bash
cd /www/wwwroot/
git clone <你的项目仓库地址> holylight-marine
cd holylight-marine
```

### 5. 配置环境变量

在项目根目录创建 `.env` 文件：

```bash
cd /www/wwwroot/holylight-marine
nano .env
```

填入以下内容（根据实际情况修改）：

```env
# 数据库配置
DATABASE_URL=mysql://holylight_user:你的数据库密码@localhost:3306/holylight_marine

# JWT密钥（随机生成一个复杂的字符串）
JWT_SECRET=your-random-jwt-secret-change-this-to-a-long-random-string

# 应用配置
VITE_APP_TITLE="深圳市好利来贸易有限公司"
VITE_APP_LOGO="/holylight_transparent.png"

# OAuth配置（如果使用Manus OAuth）
VITE_OAUTH_PORTAL_URL=https://vida.butterfly-effect.dev
OAUTH_SERVER_URL=https://vidabiz.butterfly-effect.dev
VITE_APP_ID=your-app-id

# 服务器端口
PORT=3000

# 其他必需的环境变量
OWNER_OPEN_ID=
OWNER_NAME=
BUILT_IN_FORGE_API_URL=
BUILT_IN_FORGE_API_KEY=
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=
```

保存并退出（Ctrl+O, Enter, Ctrl+X）。

### 6. 安装依赖并构建项目

使用宝塔终端或 SSH 连接服务器：

```bash
cd /www/wwwroot/holylight-marine

# 安装 pnpm（如果还没安装）
npm install -g pnpm

# 安装项目依赖
pnpm install

# 初始化数据库
pnpm db:push

# 构建项目
pnpm build
```

### 7. 使用 PM2 启动应用

```bash
# 启动应用
pm2 start dist/index.js --name holylight-marine

# 设置开机自启
pm2 startup
pm2 save

# 查看应用状态
pm2 status

# 查看日志
pm2 logs holylight-marine
```

### 8. 配置 Nginx 反向代理

1. 在宝塔面板 → **网站**
2. 点击**添加站点**
3. 填写信息：
   - 域名: `www.holylight-marine.com`
   - 根目录: `/www/wwwroot/holylight-marine/dist/client`
   - PHP版本: 纯静态
4. 点击**提交**

5. 点击刚创建的网站 → **设置** → **配置文件**

6. 修改 Nginx 配置（在 `server` 块中添加）：

```nginx
server {
    listen 80;
    server_name www.holylight-marine.com holylight-marine.com;
    
    # 静态文件目录
    root /www/wwwroot/holylight-marine/dist/client;
    index index.html;
    
    # API 代理
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 前端路由处理
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

7. 点击**保存**

8. 重载 Nginx 配置：
   - 在宝塔面板 → **软件商店** → 找到 Nginx → 点击**设置** → **重载配置**

### 9. 配置 SSL 证书（HTTPS）

1. 在网站设置中，点击 **SSL** 标签
2. 选择 **Let's Encrypt**
3. 勾选你的域名
4. 点击**申请**

宝塔会自动申请并配置免费的 SSL 证书。

### 10. 配置防火墙

在宝塔面板 → **安全**：

- 放行 80 端口（HTTP）
- 放行 443 端口（HTTPS）
- 放行 3000 端口（Node.js 应用，仅限本地访问）

在云服务商控制台的安全组中也需要放行这些端口。

## 管理员账号设置

### 方法一：通过数据库直接设置

1. 进入宝塔面板 → **数据库** → **phpMyAdmin**
2. 选择 `holylight_marine` 数据库
3. 找到 `users` 表
4. 找到你要设置为管理员的用户记录
5. 将 `role` 字段改为 `admin`
6. 保存

### 方法二：通过环境变量设置项目所有者

在 `.env` 文件中设置：

```env
OWNER_OPEN_ID=你的用户ID
OWNER_NAME=你的名字
```

项目所有者会自动获得管理员权限。

## 后台管理访问

访问 `https://www.holylight-marine.com/admin` 进入后台管理系统。

## 常用维护命令

### 查看应用状态
```bash
pm2 status
```

### 查看日志
```bash
pm2 logs holylight-marine
```

### 重启应用
```bash
pm2 restart holylight-marine
```

### 停止应用
```bash
pm2 stop holylight-marine
```

### 更新代码后重新部署
```bash
cd /www/wwwroot/holylight-marine
git pull  # 如果使用 Git
pnpm install  # 安装新依赖
pnpm db:push  # 更新数据库
pnpm build  # 重新构建
pm2 restart holylight-marine  # 重启应用
```

## 数据库备份

### 自动备份（推荐）

1. 在宝塔面板 → **计划任务**
2. 选择**备份数据库**
3. 选择 `holylight_marine` 数据库
4. 设置备份周期（建议每天凌晨）
5. 设置保留天数
6. 点击**添加任务**

### 手动备份

在宝塔面板 → **数据库** → 找到 `holylight_marine` → 点击**备份**

## 故障排查

### 网站无法访问

1. 检查 Nginx 是否运行：
   ```bash
   systemctl status nginx
   ```

2. 检查 Node.js 应用是否运行：
   ```bash
   pm2 status
   ```

3. 查看应用日志：
   ```bash
   pm2 logs holylight-marine --lines 100
   ```

### 数据库连接失败

1. 检查数据库服务是否运行
2. 检查 `.env` 文件中的 `DATABASE_URL` 是否正确
3. 检查数据库用户权限

### 后台管理无法登录

1. 确认用户的 `role` 字段是否为 `admin`
2. 检查 OAuth 配置是否正确（如果使用）
3. 查看浏览器控制台错误信息

## 性能优化建议

1. **启用 Gzip 压缩**：在 Nginx 配置中启用
2. **配置 CDN**：使用阿里云 CDN 或腾讯云 CDN
3. **数据库索引优化**：为常用查询字段添加索引
4. **Redis 缓存**：安装 Redis 用于缓存热点数据

## 安全建议

1. 定期更新系统和软件
2. 使用强密码
3. 定期备份数据
4. 限制数据库只允许本地访问
5. 启用宝塔面板的安全设置
6. 定期查看访问日志和错误日志

## 技术支持

如有问题，请联系开发团队或查看项目文档。

