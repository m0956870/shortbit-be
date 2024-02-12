const userRoute = require("express").Router();
const userAuth = require("../middlewares/userAuth");
// controller
const loginUser = require("../controllers/user/auth/loginUser");
const signupUser = require("../controllers/user/auth/signupUser");
const forgetPassword = require("../controllers/user/auth/forgetPassword");
const resetPassword = require("../controllers/user/auth/resetPassword");
const updateRegisterDetails = require("../controllers/user/updateRegisterDetails");
const getProfileDetails = require("../controllers/user/getProfileDetails");
const verifySignupOTP = require("../controllers/user/auth/verifySignupOTP");
const hostRequest = require("../controllers/user/host_request/hostRequest");
const createPost = require("../controllers/user/post/createPost");
const getAllPost = require("../controllers/user/post/getAllPost");
const followUser = require("../controllers/user/follow/followUser");
const likePost = require("../controllers/user/like/likePost");
const sharePost = require("../controllers/user/share/sharePost");
const viewPost = require("../controllers/user/view/viewPost");
const createComment = require("../controllers/user/comment/createComment");
const createLiveRoom = require("../controllers/user/live_room/host/createLiveRoom");
const endLiveRoom = require("../controllers/user/live_room/host/endLiveRoom");
const joinLiveRoom = require("../controllers/user/live_room/user/joinLiveRoom");
const leaveLiveRoom = require("../controllers/user/live_room/user/leaveLiveRoom");
const getAllLiveRooms = require("../controllers/user/live_room/getAllLiveRooms");
const ongoingLiveRoom = require("../controllers/user/live_room/host/ongoingLiveRoom");
const getAllInterest = require("../controllers/user/interest/getAllInterest");
const sendGift = require("../controllers/user/transaction/user/sendGift");
const giftListing = require("../controllers/user/gift/giftListing");
const getAllAvatar = require("../controllers/user/avatar/getAllAvatar");
const updateDetails = require("../controllers/user/updateDetails");
const videoChatInitiated = require("../controllers/user/video_chat/user/videoChatInitiated");
const getUser = require("../controllers/user/getUser");
const getComments = require("../controllers/user/comment/getComments");
const deleteComment = require("../controllers/user/comment/deleteComment");
const getFollowerListing = require("../controllers/user/follow/getFollowerListing");
const getFollowingListing = require("../controllers/user/follow/getFollowingListing");
const getAllFAQs = require("../controllers/user/app_data/getAllFAQs");
const getAppData = require("../controllers/user/app_data/getAppData");
const initiateRecharge = require("../controllers/user/recharge/initiateRecharge");
const getWalletDetails = require("../controllers/user/wallet/user/getWalletDetails");
const initiateSettlement = require("../controllers/user/settlement/host/initiateSettlement");
const getAllHostListing = require("../controllers/user/host/getAllHostListing");
const updateLiveRoomStatus = require("../controllers/user/live_room/host/updateLiveRoomStatus");
const geHomeApiDetails = require("../controllers/user/home/geHomeApiDetails");
const getLiveRoom = require("../controllers/user/live_room/getLiveRoom");


userRoute.route('/').post(signupUser).get(userAuth, getProfileDetails).patch(userAuth, updateDetails)
userRoute.route('/detail_status').patch(userAuth, updateRegisterDetails);
userRoute.get('/details/:user_id', getUser);
// auth
userRoute.post('/login', loginUser);
userRoute.post('/verify_signup_otp', verifySignupOTP);
userRoute.post("/forget_password", forgetPassword);
userRoute.post("/reset_password", resetPassword);

// home api
userRoute.route('/home').get(userAuth, geHomeApiDetails)

// user interactivity
userRoute.route('/follow/:following_id').get(userAuth, followUser)
userRoute.get('/followers', userAuth, getFollowerListing)
userRoute.get('/following', userAuth, getFollowingListing)

// post interactivity
userRoute.route('/post').post(userAuth, createPost).get(userAuth, getAllPost)
userRoute.route('/like/:post_id').get(userAuth, likePost)
userRoute.route('/view/:post_id').get(userAuth, viewPost)
userRoute.route('/share').post(userAuth, sharePost)
userRoute.route('/comment').get(userAuth, getComments).post(userAuth, createComment); userRoute.delete('/comment/:id', userAuth, deleteComment);

// HOST
userRoute.post('/host_request', userAuth, hostRequest);
userRoute.post('/initiate_settlement', userAuth, initiateSettlement);

// live & video chat module
userRoute.route('/live_room').get(userAuth, getAllLiveRooms).post(userAuth, createLiveRoom).patch(userAuth, endLiveRoom)
userRoute.route('/get_live_room').get(userAuth, getLiveRoom)

userRoute.route('/ongoing_live_room').get(userAuth, ongoingLiveRoom);
userRoute.route('/liveroom_schedular').get(userAuth, updateLiveRoomStatus);


// USER - live room
userRoute.route('/host').get(userAuth, getAllHostListing)
userRoute.route('/join_room').post(userAuth, joinLiveRoom)
userRoute.route('/leave_room').post(userAuth, leaveLiveRoom)

// videochat
userRoute.post('/videochat/initiate', userAuth, videoChatInitiated)

// gift
userRoute.post('/send_gift', userAuth, sendGift);
userRoute.route('/gift').get(userAuth, giftListing);

// recharge & wallet
userRoute.post('/recharge/initiate', userAuth, initiateRecharge);
userRoute.route('/wallet').get(userAuth, getWalletDetails);

// avatar
userRoute.route('/avatar').get(userAuth, getAllAvatar);
userRoute.route('/interest').get(getAllInterest)
userRoute.route('/faq').get(userAuth, getAllFAQs)
userRoute.route('/app_data/:key').get(getAppData)


module.exports = userRoute;