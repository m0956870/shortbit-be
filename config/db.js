const mongoose = require("mongoose")
const { ENV_MODE, DB_URI, DB_URI_LOCAL } = process.env;
const db_uri = ENV_MODE === 'production' ? DB_URI : DB_URI_LOCAL;

const connectToDBFunc = async () => {
    console.log(`Connecting to ${ENV_MODE === 'production' ? 'live' : 'local'} database...`);
    mongoose.connection
        .on('error', (err) => console.log('Database connection error:', err))
        .on('connected', () => console.log('Database connection is connected.'))
        .on('disconnected', () => console.log('Disconnected from the database.'));
    try {
        await mongoose.connect(db_uri);
        Promise.resolve();
    } catch (error) {
        mongoose.connection.close();
        Promise.reject(error);
    }
}

module.exports = connectToDBFunc;