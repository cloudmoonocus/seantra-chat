const express = require('express');
const router = express.Router();
const { UserModel } = require('../model/index.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const uuid = require('uuid');
const { authenticateToken } = require('../middleWare');

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '24h' });
};

const bcryptPassword = async (password) => {
    return await bcrypt.hash(password, 8);
};

// 注册 + 登录
router.post(
    '/auth',
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        let user = await UserModel.findOne({ email }).select('+password');
        // 用户不存在，执行注册逻辑
        if (!user) {
            const hashedPassword = await bcryptPassword(password);
            const userId = uuid.v4();
            const createdTime = Date.now();
            user = new UserModel({
                email,
                username: '用户' + userId.slice(0, 5),
                password: hashedPassword,
                userId,
                createdTime,
            });
            await user.save();
            res.send({
                code: 200,
                data: { userId, token: generateToken(userId) },
                message: '注册成功',
            });
        } else {
            // 用户存在，执行登录逻辑
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.send({ code: 400, message: '用户名或密码错误' });
            }
            const { userId } = user;
            res.send({
                code: 200,
                data: { userId, token: generateToken(userId) },
                message: '登录成功',
            });
        }
    }),
);

// 获取用户信息
router.get(
    '/info',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const { userId } = req.userData;
        const user = await UserModel.findOne({ userId });
        if (!user) {
            return res.send({ code: 404, message: '用户不存在' });
        }
        res.send({ code: 200, data: user, message: '获取成功' });
    }),
);

// 修改密码
router.post(
    '/changePassword',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const { userId } = req.userData;
        const { password, newPassword } = req.body;
        const user = await UserModel.findOne({ userId }).select('+password');
        if (!user) {
            return res.send({ code: 404, message: '用户不存在' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.send({ code: 400, message: '密码错误' });
        }
        const hashedPassword = await bcryptPassword(newPassword);
        await UserModel.updateOne({ userId }, { password: hashedPassword });
        res.send({ code: 200, message: '修改成功' });
    }),
);

// 修改用户信息
router.post(
    '/changeInfo',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const { userId } = req.userData;
        const user = await UserModel.findOne({ userId });
        if (!user) {
            return res.send({ code: 404, message: '修改失败：用户不存在' });
        }
        const disableKeys = ['userId', 'createdTime', 'password'];
        const changeKeys = Object.keys(req.body).filter((key) => !disableKeys.includes(key));
        if (changeKeys.length === 0) {
            return res.send({ code: 400, message: '修改失败：未提供修改信息' });
        }
        const changeValue = changeKeys.reduce((acc, key) => {
            acc[key] = req.body[key];
            return acc;
        }, {});
        // 检验邮箱
        if (changeValue.email) {
            const user = await UserModel.findOne({ email: changeValue.email });
            if (user) {
                return res.send({
                    code: 400,
                    message: '修改失败：邮箱已被注册',
                });
            }
        }
        await UserModel.updateOne({ userId }, changeValue);
        res.send({ code: 200, message: '修改成功' });
    }),
);

module.exports = router;
