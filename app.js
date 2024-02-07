const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

const adminRoute = require('./routes/adminRoutes');
const agencyRoute = require('./routes/agencyRoutes');
const userRoute = require('./routes/userRoutes');
const unspecifiedRouteHandler = require('./routes/unspecifiedRouteHandler');
const { finalErrorHandler } = require('./errorHandler/apiErrorHandler');
const sendNotification = require('./utils/sendNotification');

app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(express.json({ limit: '100kb' }));

app.use('/image', express.static("images"));
app.use('/video', express.static("videos"));
app.use('/audio', express.static("audios"));

// routes
app.use('/api/admin', adminRoute);
app.use('/api/agency', agencyRoute);
app.use('/api/user', userRoute);

app.get('/api/test', (req, res) => res.json({ status: true, message: 'Working fine...' }));
app.get('/api/notification_test', async (req, res) => {
    let { token, data } = req.body;
    try {
        // let data =  await sendNotification(token, data)
        res.send(await sendNotification(token, data))
    } catch (error) {
        res.send("error")
        console.log("/api/test error", error)
    }
});

// error handles
app.use(unspecifiedRouteHandler);
app.use(finalErrorHandler);

module.exports = app;