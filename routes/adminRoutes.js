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
const updateInterest = require('../controllers/admin/interest/updateInterest');
const getAllIGifts = require('../controllers/admin/gift/getAllIGifts');
const createGift = require('../controllers/admin/gift/createGift');
const updateGift = require('../controllers/admin/gift/updateGift');
const deleteGift = require('../controllers/admin/gift/deleteGift');
const updateBalance = require('../controllers/admin/transaction/user/updateBalance');

adminRoute.post('/login', loginAdmin);
adminRoute.route('/').post(signupAdmin).get(adminAuth, getAdminDetails)

adminRoute.route('/host').patch(adminAuth, approveHost)
adminRoute.route('/update_balance').post(adminAuth, updateBalance)

// master data
adminRoute.route('/gift').get(adminAuth, getAllIGifts).post(adminAuth, createGift).patch(adminAuth, updateGift); adminRoute.delete('/gift/:id', adminAuth, deleteGift);
adminRoute.route('/interest').get(adminAuth, getAllInterest).post(adminAuth, createInterest).patch(adminAuth, updateInterest); adminRoute.delete('/interest/:id', adminAuth, deleteInterest);
adminRoute.route('/audio').get(getAllAudio).post(adminAuth, addAudio);

module.exports = adminRoute;