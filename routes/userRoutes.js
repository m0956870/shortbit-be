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
const createMessageGroup = require("../controllers/user/message_group/createMessageGroup");
const getAllMessageGroup = require("../controllers/user/message_group/getAllMessageGroup");
const getVoiceRoom = require("../controllers/user/voice_room/getVoiceRoom");
const getAllVoiceRooms = require("../controllers/user/voice_room/getAllVoiceRooms");
const createVoiceRoom = require("../controllers/user/voice_room/host/createVoiceRoom");
const endVoiceRoom = require("../controllers/user/voice_room/host/endVoiceRoom");
const ongoingVoiceRoom = require("../controllers/user/voice_room/host/ongoingVoiceRoom");
const joinVoiceRoom = require("../controllers/user/voice_room/user/joinVoiceRoom");
const leaveVoiceRoom = require("../controllers/user/voice_room/user/leaveVoiceRoom");
const requestSlot = require("../controllers/user/voice_room/user/requestSlot");
const approveSlot = require("../controllers/user/voice_room/host/approveSlot");
const leaveSlot = require("../controllers/user/voice_room/user/leaveSlot");
const updateVideoChat = require("../controllers/user/video_chat/updateVideoChat");
const videoChatScheduler = require("../controllers/user/video_chat/videoChatScheduler");
const getAllWalletPackage = require("../controllers/user/wallet_package/getAllWalletPackage");
const getUserNotification = require("../controllers/user/notification/getUserNotification");
const updateNotification = require("../controllers/user/notification/updateNotification");
const userActiveStatus = require("../controllers/user/userActiveStatus");

userRoute.route('/').post(signupUser).get(userAuth, getProfileDetails).patch(userAuth, updateDetails)
userRoute.route('/detail_status').patch(userAuth, updateRegisterDetails);
userRoute.get('/details/:user_id', getUser);
// auth
userRoute.post('/login', loginUser);
// userRoute.post('/logout', userAuth, logoutUser);
userRoute.post('/active_status', userAuth, userActiveStatus);
userRoute.post('/verify_signup_otp', verifySignupOTP);
userRoute.post("/forget_password", forgetPassword);
userRoute.post("/reset_password", resetPassword);

// home api
userRoute.route('/home').get(userAuth, geHomeApiDetails)

// user interactivity
userRoute.route('/follow').post(userAuth, followUser)
userRoute.get('/followers', userAuth, getFollowerListing)
userRoute.get('/following', userAuth, getFollowingListing)

// notification
userRoute.route('/notification').get(userAuth, getUserNotification).patch(userAuth, updateNotification)

// post interactivity
userRoute.route('/post').post(userAuth, createPost).get(userAuth, getAllPost)
userRoute.route('/like/:post_id').get(userAuth, likePost)
userRoute.route('/view/:post_id').get(userAuth, viewPost)
userRoute.route('/share').post(userAuth, sharePost)
userRoute.route('/comment').get(userAuth, getComments).post(userAuth, createComment); userRoute.delete('/comment/:id', userAuth, deleteComment);

// HOST
userRoute.route('/host').get(userAuth, getAllHostListing)
userRoute.post('/host_request', userAuth, hostRequest);
userRoute.post('/initiate_settlement', userAuth, initiateSettlement);

// live room module
userRoute.route('/get_live_room').get(userAuth, getLiveRoom)
// HOST
userRoute.route('/live_room').get(userAuth, getAllLiveRooms).post(userAuth, createLiveRoom).patch(userAuth, endLiveRoom)
userRoute.route('/ongoing_live_room').get(userAuth, ongoingLiveRoom);
userRoute.route('/liveroom_schedular').get(userAuth, updateLiveRoomStatus);
// USER - live room
userRoute.route('/join_room').post(userAuth, joinLiveRoom)
userRoute.route('/leave_room').post(userAuth, leaveLiveRoom)

// voice room module
userRoute.route('/get_voice_room').get(userAuth, getVoiceRoom)
// HOST
userRoute.route('/voice_room').get(userAuth, getAllVoiceRooms).post(userAuth, createVoiceRoom).patch(userAuth, endVoiceRoom)
userRoute.route('/ongoing_voice_room').get(userAuth, ongoingVoiceRoom);
userRoute.route('/approve_slot').post(userAuth, approveSlot);
// userRoute.route('/liveroom_schedular').get(userAuth, updateLiveRoomStatus);
// // USER - live room
userRoute.route('/join_voice_room').post(userAuth, joinVoiceRoom)
userRoute.route('/leave_voice_room').post(userAuth, leaveVoiceRoom)
userRoute.route('/voiceroom_slot').post(userAuth, requestSlot).patch(userAuth, leaveSlot)

// videochat
userRoute.route('/videochat').post(userAuth, videoChatInitiated).patch(userAuth, updateVideoChat)
userRoute.route('/videochat_scheduler').post(userAuth, videoChatScheduler)

// message
userRoute.route('/message_group').post(userAuth, createMessageGroup).get(userAuth, getAllMessageGroup)

// gift
userRoute.post('/send_gift', userAuth, sendGift);
userRoute.route('/gift').get(userAuth, giftListing);

// recharge & wallet
userRoute.post('/recharge/initiate', userAuth, initiateRecharge);
userRoute.route('/wallet').get(userAuth, getWalletDetails);
userRoute.route('/wallet_package').get(userAuth, getAllWalletPackage);

// avatar
userRoute.route('/avatar').get(userAuth, getAllAvatar);
userRoute.route('/interest').get(getAllInterest)
userRoute.route('/faq').get(userAuth, getAllFAQs)
userRoute.route('/app_data/:key').get(getAppData)


module.exports = userRoute;