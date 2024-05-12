const asyncHandler = require('express-async-handler');
const { verify } = require('jsonwebtoken');
const { getUser } = require('./util');

// token 验证中间件
const authenticateToken = asyncHandler((req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.send({ code: 401, message: '未登录' });
    }
    verify(token, process.env.SECRET_KEY, async (err, data) => {
        if (!data || err) {
            return res.send({
                code: 401,
                message: '登录状态已过期，请重新登录',
            });
        }
        // ! 如果有 userId 参数，则直接获取对应用户的信息
        if (req.query.userId) {
            req.userData = await getUser(req.query.userId);
            return next();
        }
        const { userId } = data;
        req.userData = (await getUser(userId)) ?? {};
        next();
    });
});

module.exports = {
    authenticateToken,
};
