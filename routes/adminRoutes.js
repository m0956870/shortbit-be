const adminRoute = require('express').Router();
const adminAuth = require('../middlewares/adminAuth');
// controllers
const loginAdmin = require('../controllers/admin/auth/loginAdmin');
const signupAdmin = require('../controllers/admin/auth/signupAdmin');
const getAdminDetails = require('../controllers/admin/getAdminDetails');
const createInterest = require('../controllers/admin/interest/createInterest');
const deleteInterest = require('../controllers/admin/interest/deleteInterest');
const getAllInterest = require('../controllers/admin/interest/getAllInterest');
const addAudio = require('../controllers/admin/audio/addAudio');
const getAllAudio = require('../controllers/admin/audio/getAllAudio');
const updateInterest = require('../controllers/admin/interest/updateInterest');
const getAllIGifts = require('../controllers/admin/gift/getAllIGifts');
const createGift = require('../controllers/admin/gift/createGift');
const updateGift = require('../controllers/admin/gift/updateGift');
const deleteGift = require('../controllers/admin/gift/deleteGift');
const updateBalance = require('../controllers/admin/transaction/user/updateBalance');
const createAvatar = require('../controllers/admin/avatar/createAvatar');
const updateAvatar = require('../controllers/admin/avatar/updateAvatar');
const getAllAvatar = require('../controllers/admin/avatar/getAllAvatar');
const deleteAvatar = require('../controllers/admin/avatar/deleteAvatar');
const forgetPassword = require('../controllers/admin/auth/forgetPassword');
const resetPassword = require('../controllers/admin/auth/resetPassword');
const getAllAgencyListing = require('../controllers/admin/agency/getAllAgencyListing');
const getAllHostListing = require('../controllers/admin/host/getAllHostListing');
const getAllUserListing = require('../controllers/admin/user/getAllUserListing');
const updateUser = require('../controllers/admin/user/updateUser');
const updateHost = require('../controllers/admin/host/updateHost');

adminRoute.post('/login', loginAdmin);
adminRoute.post("/forget_password", forgetPassword);
adminRoute.post("/reset_password", resetPassword);
adminRoute.route('/').post(signupAdmin).get(adminAuth, getAdminDetails)

// agency
adminRoute.route('/agency').get(adminAuth, getAllAgencyListing)

// USER
adminRoute.route('/update_balance').post(adminAuth, updateBalance)

// host
adminRoute.route('/host').get(adminAuth, getAllHostListing).patch(adminAuth, updateHost)
// user
adminRoute.route('/user').get(adminAuth, getAllUserListing).patch(adminAuth, updateUser)

// master data
adminRoute.route('/gift').get(adminAuth, getAllIGifts).post(adminAuth, createGift).patch(adminAuth, updateGift); adminRoute.delete('/gift/:id', adminAuth, deleteGift);
adminRoute.route('/interest').get(adminAuth, getAllInterest).post(adminAuth, createInterest).patch(adminAuth, updateInterest); adminRoute.delete('/interest/:id', adminAuth, deleteInterest);
adminRoute.route('/avatar').get(adminAuth, getAllAvatar).post(adminAuth, createAvatar).patch(adminAuth, updateAvatar); adminRoute.delete('/avatar/:id', adminAuth, deleteAvatar);
adminRoute.route('/audio').get(getAllAudio).post(adminAuth, addAudio);

module.exports = adminRoute;