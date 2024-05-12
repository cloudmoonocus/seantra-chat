<div align="center">
  <img src="./client/src/app/icon.png" alt="logo" width="200px" />
</div>
<div align="center">
  <h1>Seantra-Chat 在线多人聊天应用</h1>
    <img src="https://img.shields.io/github/release/cloudmoonocus/seantra-chat" />
    <img src="https://img.shields.io/github/license/cloudmoonocus/seantra-chat.svgS" />
</div>

- 💁🏻 前端：![Next.js](https://img.shields.io/badge/Next.js-gray?logo=next.js
  ) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-gray?logo=TailwindCSS
  ) ![Socket.io](https://img.shields.io/badge/Socket.io-gray?logo=socketio
  )
- 💻 后端：![express](https://img.shields.io/badge/Express-gray?logo=express
  ) ![MongoDB](https://img.shields.io/badge/MongoDB-gray?logo=mongodb
  ) ![Socket.io](https://img.shields.io/badge/Socket.io-gray?logo=socketio
  )
- - -

本项目使用 concurrently 并行启动多个服务，分别是：

- Next.js 前端服务器
- Express 后端服务器

### 开发

在 /server 目录下新建 .env.local, 新增如下配置

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
yarn dev
```

### 构建

```bash
yarn build
```

### 启动

```bash
yarn start
```
