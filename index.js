require('dotenv').config();
const app = require('./app');
const connectToDBFunc = require('./config/db');
const PORT = process.env.PORT

const initializeServer = async () => {
    try {
        await connectToDBFunc();
        app.listen(PORT, () => console.log(`server is running at ${PORT}`));
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
initializeServer();