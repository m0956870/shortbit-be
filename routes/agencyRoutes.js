const agencyRoute = require("express").Router();
const signupAgnecy = require('..//controllers/agency/auth/signupAgnecy');

agencyRoute.route('/').post(signupAgnecy)

module.exports = agencyRoute;