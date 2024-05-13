const mongoose = require('mongoose');

module.exports = async function connectMongoDB() {
    const mongoString = process.env.DATABASE_URL;
    const database = mongoose.connection;
    try {
        if (!mongoString) {
            return;
        }
        await mongoose.connect(mongoString);

        database.on('error', (error) => {
            console.log(error);
        });
        database.once('connected', () => {
            console.log('Database Connected');
        });
    } catch (e) {
        console.error(e);
    }
};
