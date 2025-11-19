# 💝 我们的纪念日 - Anniversary Calendar

一个美丽的时间轴网站，用于记录和珍藏恋人之间的重要时刻。

## ✨ 功能特性

- 📅 **时间轴视图**: 按时间顺序展示所有纪念日
- 💖 **美观设计**: 浪漫的粉色主题，精心设计的UI
- 📱 **移动优先**: 完全响应式设计，支持320px最小宽度
- 🖼️ **图片支持**: 自动优化图片，支持WebP/AVIF格式
- ⏰ **时间计算**: 自动计算"X年Y个月前"，特别标记第一个纪念日
- ♿ **无障碍**: 符合WCAG 2.1 AA标准

## 🚀 快速开始

### 前置要求

- Node.js 20+
- pnpm 8+
- PostgreSQL 15+
- Docker (可选，用于生产部署)

### 安装步骤

1. **安装依赖**

```bash
pnpm install
```

2. **配置环境变量**

创建 `.env` 文件：

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/my_lover"
NODE_ENV="development"
```

3. **初始化数据库**

```bash
# 生成 Prisma Client
pnpm prisma generate

# 运行数据库迁移
pnpm prisma migrate dev

# 填充示例数据（可选）
pnpm prisma db seed
```

4. **启动开发服务器**

```bash
pnpm dev
```

访问 http://localhost:3000 查看应用！

## 📦 项目结构

```
my_lover/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API路由
│   │   ├── page.tsx      # 主页
│   │   └── layout.tsx    # 根布局
│   ├── components/       # React组件
│   │   ├── ui/           # 基础UI组件
│   │   └── features/     # 功能组件
│   ├── hooks/            # 自定义Hooks
│   ├── lib/              # 工具函数
│   └── types/            # TypeScript类型
├── prisma/               # Prisma配置
│   ├── schema.prisma     # 数据库模型
│   └── seed.ts           # 种子数据
└── public/               # 静态资源
```

## 🛠️ 可用脚本

```bash
pnpm dev              # 启动开发服务器
pnpm build            # 构建生产版本
pnpm start            # 运行生产服务器
pnpm lint             # 运行ESLint
pnpm format           # 格式化代码
pnpm type-check       # TypeScript类型检查
pnpm test             # 运行测试
pnpm prisma:studio    # 打开Prisma Studio
```

## 🐳 Docker部署

使用Docker Compose一键部署：

```bash
# 启动所有服务
docker-compose up -d --build

# 运行数据库迁移
docker-compose exec app pnpm prisma migrate deploy

# 查看日志
docker-compose logs -f app

# 停止服务
docker-compose down
```

访问 http://localhost:3000

## 🎨 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript 5.3+
- **样式**: Tailwind CSS 3.4+
- **数据库**: PostgreSQL 15+ + Prisma ORM
- **状态管理**: SWR
- **表单**: React Hook Form + Zod
- **日期处理**: date-fns
- **图片优化**: Sharp
- **测试**: Vitest + Playwright
- **部署**: Docker + Docker Compose

## 📝 开发状态

**当前版本**: MVP v1.0 (User Story 1)

✅ **已完成**:
- Phase 1: 项目设置和配置 (7/7 tasks)
- Phase 2: 基础设施 (15/16 tasks)
- Phase 3: User Story 1 - 时间轴视图 (13/14 tasks)

**总进度**: 35/37 MVP tasks completed (94.6%)

⏳ **待完成**:
- T010: 运行数据库迁移（需要数据库连接）
- T037: 移动设备测试

📋 **下一步**:
- User Story 2: 添加和编辑纪念日
- User Story 3: 即将到来的纪念日提醒
- User Story 4: 时间计算增强

## 🤝 贡献

欢迎贡献！请查看 `specs/001-anniversary-calendar/` 目录了解详细的技术规范和任务列表。

## 📄 许可证

私有项目 - 仅供个人使用

## 💖 致谢

献给所有珍惜每一个美好时刻的恋人们。

---

**开始记录你们的故事吧！** 🎉
