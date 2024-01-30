const agencyRoute = require("express").Router();
const agencyAuth = require("../middlewares/agencyAuth");
// controller
const signupAgnecy = require('..//controllers/agency/auth/signupAgnecy');
const loginAgency = require("../controllers/agency/auth/loginAgency");
const forgetPassword = require("../controllers/agency/auth/forgetPassword");
const resetPassword = require("../controllers/agency/auth/resetPassword");
const getAgencyDetails = require("../controllers/agency/getAgencyDetails");

agencyRoute.post('/login', loginAgency);
agencyRoute.post("/forget_password", forgetPassword);
agencyRoute.post("/reset_password", resetPassword);

agencyRoute.route('/').post(signupAgnecy).get(agencyAuth, getAgencyDetails)

module.exports = agencyRoute;