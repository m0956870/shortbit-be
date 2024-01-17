const agencyRoute = require("express").Router();
const agencyAuth = require("../middlewares/agencyAuth");
// controller
const signupAgnecy = require('..//controllers/agency/auth/signupAgnecy');
const loginAgency = require("../controllers/agency/auth/loginAgency");
const getAgencyDetails = require("../controllers/agency/getAgencyDetails");

agencyRoute.post('/login', loginAgency);
agencyRoute.route('/').post(signupAgnecy).get(agencyAuth, getAgencyDetails)

module.exports = agencyRoute;