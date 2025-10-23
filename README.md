# 深圳市好利来贸易有限公司官网

一个现代化的企业官网，包含前台展示和后台管理系统。

## 功能特性

### 前台展示
- ✅ 响应式设计，支持PC和移动端
- ✅ 轮播图展示
- ✅ 公司简介
- ✅ 产品类别展示
- ✅ 合作伙伴展示
- ✅ 新闻资讯
- ✅ 导航栏滚动缩小效果
- ✅ 返回顶部按钮

### 后台管理系统
- ✅ 管理员登录验证
- ✅ 轮播图管理（增删改查）
- ✅ 产品类别管理
- ✅ 合作伙伴管理
- ✅ 新闻资讯管理
- ✅ 文件上传功能（S3存储）

### 技术特性
- ✅ 前后端分离架构
- ✅ tRPC 类型安全的 API
- ✅ MySQL 数据库
- ✅ 用户认证系统
- ✅ 数据动态加载

## 技术栈

### 前端
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- Wouter (路由)
- TanStack Query (数据获取)

### 后端
- Node.js
- Express
- tRPC 11
- Drizzle ORM
- MySQL

### 开发工具
- Vite
- pnpm
- ESLint
- Prettier

## 本地开发

### 环境要求
- Node.js 18+
- pnpm
- MySQL 8.0+

### 安装步骤

1. 克隆项目
```bash
git clone <repository-url>
cd holylight-marine
```

2. 安装依赖
```bash
pnpm install
```

3. 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入数据库连接信息等。

4. 初始化数据库
```bash
pnpm db:push
```

5. 启动开发服务器
```bash
pnpm dev
```

访问 `http://localhost:3000` 查看网站。

## 项目结构

```
holylight-marine/
├── client/                 # 前端代码
│   ├── public/            # 静态资源
│   └── src/
│       ├── components/    # React 组件
│       │   ├── admin/    # 后台管理组件
│       │   └── ui/       # UI 组件库
│       ├── pages/        # 页面组件
│       ├── lib/          # 工具函数
│       └── App.tsx       # 应用入口
├── server/                # 后端代码
│   ├── _core/            # 核心功能
│   ├── db.ts             # 数据库操作
│   ├── routers.ts        # tRPC 路由
│   └── storage.ts        # 文件存储
├── drizzle/              # 数据库 Schema
│   └── schema.ts         # 数据表定义
├── shared/               # 共享代码
└── DEPLOYMENT.md         # 部署文档
```

## 数据库表结构

### users (用户表)
- 用户认证信息
- 角色管理（admin/user）

### banners (轮播图表)
- 轮播图标题、副标题
- 图片URL
- 排序和状态

### productCategories (产品类别表)
- 类别名称、描述
- 图片URL
- 排序和状态

### partners (合作伙伴表)
- 合作伙伴名称
- Logo URL
- 网站链接

### news (新闻资讯表)
- 新闻标题、内容
- 图片URL
- 发布日期

### companyInfo (公司信息表)
- 公司简介等信息

## API 接口

项目使用 tRPC 提供类型安全的 API，主要接口包括：

### 公开接口
- `banners.list` - 获取激活的轮播图
- `productCategories.list` - 获取激活的产品类别
- `partners.list` - 获取激活的合作伙伴
- `news.list` - 获取激活的新闻

### 管理员接口（需要登录）
- `banners.listAll/create/update/delete` - 轮播图管理
- `productCategories.listAll/create/update/delete` - 产品类别管理
- `partners.listAll/create/update/delete` - 合作伙伴管理
- `news.listAll/create/update/delete` - 新闻管理

## 部署

详细部署步骤请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 快速部署到宝塔面板

1. 安装宝塔面板
2. 安装 Nginx、MySQL、Node.js、PM2
3. 创建数据库
4. 上传项目文件
5. 配置环境变量
6. 构建并启动项目
7. 配置 Nginx 反向代理
8. 申请 SSL 证书

## 管理员设置

### 设置管理员账号

方法一：通过数据库
1. 登录 phpMyAdmin
2. 找到 `users` 表
3. 将用户的 `role` 字段改为 `admin`

方法二：通过环境变量
在 `.env` 中设置：
```env
OWNER_OPEN_ID=用户ID
```

## 后台管理

访问 `/admin` 路径进入后台管理系统。

功能包括：
- 轮播图管理
- 产品类别管理
- 合作伙伴管理
- 新闻资讯管理

## 开发命令

```bash
# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码格式化
pnpm format

# 数据库迁移
pnpm db:push

# 类型检查
pnpm typecheck
```

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 许可证

Copyright © 2025 深圳市好利来贸易有限公司

## 联系方式

如有问题，请联系开发团队。

