const mongoose = require('mongoose');
const { DATABASE_OPTIONS } = require('../config/database');
const connectDB = async (url) => {
    return mongoose
        .connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log('Connected to DB');
        })
        .catch((err) => {
            console.log(err);
        });
};
module.exports = connectDB;
