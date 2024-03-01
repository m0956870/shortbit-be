const axios = require("axios")

const sendNotification = async (deviceToken, notification, data) => {
    console.log("notifiction =============>", deviceToken, notification, data)
    let config = {
        method: 'post',
        url: 'https://fcm.googleapis.com/fcm/send',
        headers: { Authorization: process.env.FCM_APIKEY, 'Content-Type': 'application/json', },
        data: {
            to: deviceToken,
            priority: "high",
            notification,
            data,
        }
    };

    try {
        let { data } = await axios(config);
        return data;
    } catch (error) {
        console.log("sendNotification error", error);
        return error;
    }
}

module.exports = sendNotification;