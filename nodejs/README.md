# Node.js 后端

当前目录是照片墙后端的 Node.js 实现，基于 Express 构建。

## 目录说明

- `app.js`：应用入口
- `routes/`：路由定义
- `controller/`：业务控制器
- `middleware/`：中间件
- `utils/`：通用工具函数
- `config/`：数据库和业务配置

## 启动方式

```bash
npm install
npm start
```

默认端口为 `4001`，可通过环境变量 `PORT` 覆盖。

## 环境变量

- `PORT`：服务端口
- `SESSION_SECRET`：Session 密钥
- 其他配置请按实际部署环境补充到 `.env`

## 说明

该实现现已并入仓库根目录的 `photo-wall-server` 中，与 `php/` 目录下的 PHP 实现并行维护。
