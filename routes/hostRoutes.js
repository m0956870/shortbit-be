const hostRoute = require('express').Router();
const createHost = require('../controllers/host/auth/createHost');

hostRoute.route('/').post(createHost)

module.exports = hostRoute;