# 1MOX 发卡系统

一个基于 `Next.js + Prisma + PostgreSQL` 的简单发卡网站，可直接部署到 Vercel。

## 已实现功能

- 前台卡密兑换页
- 后台管理员登录
- 批量生成卡密
- 支持文本内容或文件链接兑换
- 支持使用次数限制
- 支持过期时间
- 记录兑换日志

## 技术栈

- `Next.js 16`
- `TypeScript`
- `Prisma`
- `PostgreSQL`
- `Tailwind CSS`

## 本地启动

1. 安装依赖
2. 初始化数据库
3. 启动开发环境

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

打开浏览器访问：`http://localhost:3012`

本地开发需要先在 `.env` 中配置 PostgreSQL 数据库连接：

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123456"
JWT_SECRET="replace-with-a-long-random-secret"
```

## 管理员默认账号

- 账号：`admin`
- 密码：`admin123456`

可在 `.env` 中修改：

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `JWT_SECRET`

## Vercel 部署

部署前需要准备一个 PostgreSQL 数据库。推荐使用：

- Vercel Postgres
- Neon
- Supabase PostgreSQL
- Railway PostgreSQL

在 Vercel 项目设置中添加环境变量：

- `DATABASE_URL`：PostgreSQL 连接字符串
- `ADMIN_USERNAME`：后台账号
- `ADMIN_PASSWORD`：后台密码
- `JWT_SECRET`：随机长密钥，建议至少 32 位

部署流程：

1. 将项目上传到 GitHub。
2. 在 Vercel 导入该仓库。
3. 添加上面的环境变量。
4. 首次部署前，在本地或 Vercel CLI 执行数据库同步：

```bash
npx prisma db push
```

5. Vercel 会执行 `npm run build`，该命令会自动运行 `prisma generate && next build`。

注意：Vercel 的无服务器环境不适合使用本地 SQLite 文件，因此项目已切换为 PostgreSQL。

## 页面说明

- `/`：用户兑换卡密
- `/admin`：管理员登录
- `/admin/dashboard`：发卡后台

## 文件链接说明

当前 MVP 的“文件”模式使用的是**文件下载链接**。也就是说：

- 在后台创建卡密时填写文件 URL
- 用户兑换后点击链接下载文件

如果你后续需要，我可以继续帮你加：

- 文件上传到本地或对象存储
- 一卡一文件
- 支付购买后自动发卡
- 更强的后台权限系统
