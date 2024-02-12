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
const deleteAudio = require('../controllers/admin/audio/deleteAudio');
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
const getAllHomeBanner = require('../controllers/admin/home_banner/getAllHomeBanner');
const createHomeBanner = require('../controllers/admin/home_banner/createHomeBanner');
const updateHomeBanner = require('../controllers/admin/home_banner/updateHomeBanner');
const deleteHomeBanner = require('../controllers/admin/home_banner/deleteHomeBanner');
const getAllFAQ = require('../controllers/admin/faq/getAllFAQ');
const createFAQ = require('../controllers/admin/faq/createFAQ');
const updateFAQ = require('../controllers/admin/faq/updateFAQ');
const deleteFAQ = require('../controllers/admin/faq/deleteFAQ');
const getAllAppData = require('../controllers/admin/app_data/getAllAppData');
const createAppData = require('../controllers/admin/app_data/createAppData');
const updateAppData = require('../controllers/admin/app_data/updateAppData');
const getSettlementListing = require('../controllers/admin/settlement/getSettlementListing');
const updateSettlement = require('../controllers/admin/settlement/updateSettlement');
const getTopReceivers = require('../controllers/admin/host/getTopReceivers');
const getAllGivers = require('../controllers/admin/user/getAllGivers');
const getWalletDetails = require('../controllers/admin/wallet/getWalletDetails');
const createAgency = require('../controllers/admin/agency/createAgency');
const updateAgency = require('../controllers/admin/agency/updateAgency');

adminRoute.post('/login', loginAdmin);
adminRoute.post("/forget_password", forgetPassword);
adminRoute.post("/reset_password", resetPassword);
adminRoute.route('/').post(signupAdmin).get(adminAuth, getAdminDetails);

// agency
adminRoute.route('/agency').post(adminAuth, createAgency).get(adminAuth, getAllAgencyListing).patch(adminAuth, updateAgency)
// settlement
adminRoute.route('/settlement').get(adminAuth, getSettlementListing).patch(adminAuth, updateSettlement)

// USER
adminRoute.route('/user_wallet').get(adminAuth, getWalletDetails);
adminRoute.route('/update_balance').post(adminAuth, updateBalance);
adminRoute.route('/top_receiver').get(adminAuth, getTopReceivers);
adminRoute.route('/top_givers').get(adminAuth, getAllGivers);

// host
adminRoute.route('/host').get(adminAuth, getAllHostListing).patch(adminAuth, updateHost);
// user
adminRoute.route('/user').get(adminAuth, getAllUserListing).patch(adminAuth, updateUser);

// master data
adminRoute.route('/gift').get(adminAuth, getAllIGifts).post(adminAuth, createGift).patch(adminAuth, updateGift); adminRoute.delete('/gift/:id', adminAuth, deleteGift);
adminRoute.route('/interest').get(adminAuth, getAllInterest).post(adminAuth, createInterest).patch(adminAuth, updateInterest); adminRoute.delete('/interest/:id', adminAuth, deleteInterest);
adminRoute.route('/avatar').get(adminAuth, getAllAvatar).post(adminAuth, createAvatar).patch(adminAuth, updateAvatar); adminRoute.delete('/avatar/:id', adminAuth, deleteAvatar);
adminRoute.route('/home_banner').get(adminAuth, getAllHomeBanner).post(adminAuth, createHomeBanner).patch(adminAuth, updateHomeBanner); adminRoute.delete('/home_banner/:id', adminAuth, deleteHomeBanner);
adminRoute.route('/audio').get(getAllAudio).post(adminAuth, addAudio); adminRoute.delete('/audio/:id', adminAuth, deleteAudio);

adminRoute.route('/faq').get(adminAuth, getAllFAQ).post(adminAuth, createFAQ).patch(adminAuth, updateFAQ); adminRoute.delete('/faq/:id', adminAuth, deleteFAQ);
adminRoute.route('/app_data').get(adminAuth, getAllAppData).post(adminAuth, createAppData).patch(adminAuth, updateAppData); // adminRoute.delete('/app_data/:id', adminAuth, deleteFAQ);

module.exports = adminRoute;