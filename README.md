<div align="center">
  <img src="./client/src/app/icon.png" alt="logo" width="200px" />
</div>
<div align="center">
  <h1>Seantra-Chat 在线多人聊天应用</h1>
    <img src="https://img.shields.io/github/release/cloudmoonocus/seantra-chat" />
    <img src="https://img.shields.io/github/license/cloudmoonocus/seantra-chat.svgS" />
</div>
<div align="center">
    <img src="https://img.shields.io/badge/前端-gray?logo=html5" />
    <img src="https://img.shields.io/badge/|-gray" />
    <img src="https://img.shields.io/badge/Next.js-gray?logo=next.js" />
    <img src="https://img.shields.io/badge/region/core-gray?logo=baidu" />
    <img src="https://img.shields.io/badge/TailwindCSS-gray?logo=TailwindCSS" />
    <img src="https://img.shields.io/badge/shadcn/ui-gray?logo=shadcnui" />
    <img src="https://img.shields.io/badge/Socket.io-gray?logo=socket.io" />
</div>
<div align="center">
    <img src="https://img.shields.io/badge/后端-gray?logo=node.js" />
    <img src="https://img.shields.io/badge/|-gray" />
    <img src="https://img.shields.io/badge/Express-gray?logo=express" />
    <img src="https://img.shields.io/badge/MongoDB-gray?logo=mongodb" />
    <img src="https://img.shields.io/badge/Mongoose-gray?logo=mongoose" />
    <img src="https://img.shields.io/badge/Socket.io-gray?logo=socket.io" />
</div>

- - -

本项目使用 concurrently 并行启动多个服务，分别是：

- Next.js 前端服务器
- Express 后端服务器

### 开发

在 /server 目录下新建 `.env.local`, 新增如下配置

```dotenv
DATABASE_URL = [MongoDB 连接地址] (例如 mongodb://localhost:27017/next-starter)
SECRET_KEY = [该应用程序的秘钥]
```

秘钥可通过以下 Node 代码生成：
```js
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');
process.env.SECRET_KEY = secretKey;
```

```bash
nvm use

// 安装依赖
pnpm install
// 如果在根目录安装报错，执行以下命令
cd client && pnpm install
cd server && pnpm install

// 启动开发
pnpm dev
```

### 构建

```bash
nvm use
pnpm build
```

### 启动

```bash
nvm use
pnpm start
```
