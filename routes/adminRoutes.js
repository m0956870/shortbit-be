const adminRoute = require('express').Router();
const adminAuth = require('../middlewares/adminAuth');
// controllers
const loginAdmin = require('../controllers/admin/auth/loginAdmin');
const signupAdmin = require('../controllers/admin/auth/signupAdmin');
const getAdminDetails = require('../controllers/admin/getAdminDetails');
const approveHost = require('../controllers/admin/host/approveHost');
const createInterest = require('../controllers/admin/interest/createInterest');
const deleteInterest = require('../controllers/admin/interest/deleteInterest');
const getAllInterest = require('../controllers/admin/interest/getAllInterest');
const addAudio = require('../controllers/admin/audio/addAudio');
const getAllAudio = require('../controllers/admin/audio/getAllAudio');

adminRoute.post('/login', loginAdmin);
adminRoute.route('/').post(signupAdmin).get(adminAuth, getAdminDetails)

adminRoute.route('/host').patch(adminAuth, approveHost)

// master data
adminRoute.route('/interest').get(getAllInterest).post(createInterest); adminRoute.delete('/interest/:id', deleteInterest);
adminRoute.route('/audio').get(getAllAudio).post(adminAuth, addAudio);

module.exports = adminRoute;