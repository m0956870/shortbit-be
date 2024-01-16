const hostRoute = require('express').Router();
const hostAuth = require("../middlewares/hostAuth");
// controller
const registerHost = require('../controllers/host/auth/registerHost');
const getHostDetails = require('../controllers/host/getHostDetails');

hostRoute.post('/register', registerHost);
hostRoute.route('/').get(hostAuth, getHostDetails)

module.exports = hostRoute;