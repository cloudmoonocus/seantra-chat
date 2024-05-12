const { UserModel } = require('./model');

const getUser = async (userId) => {
    if (!userId) {
        return;
    }
    const user = await UserModel.findOne({ userId });
    return user;
};

module.exports = {
    getUser,
};
