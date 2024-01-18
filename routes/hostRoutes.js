const hostRoute = require('express').Router();
const hostAuth = require("../middlewares/hostAuth");
// controller
const registerHost = require('../controllers/host/auth/registerHost');
const getHostDetails = require('../controllers/host/getHostDetails');
const createPost = require('../controllers/host/post/createPost');

hostRoute.post('/register', registerHost);
hostRoute.route('/').get(hostAuth, getHostDetails)

hostRoute.route('/post').post(hostAuth, createPost)

module.exports = hostRoute;