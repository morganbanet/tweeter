const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const {
  registerUser,
  loginUser,
  logoutUser,
  userProfile,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  updateBio,
  uploadAvatar,
  deleteAvatar,
  uploadBanner,
  deleteBanner,
  deleteUser,
} = require('../controllers/authController');

// Authentication
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(protect, logoutUser);
router.route('/profile').get(protect, userProfile);
router.route('/bio').patch(protect, updateBio);
router.route('/updatedetails').patch(protect, updateDetails);
router.route('/updatepassword').put(protect, updatePassword);
router.route('/forgotpassword').put(forgotPassword);
router.route('/resetpassword/:resettoken').put(resetPassword);
router.route('/delete').delete(protect, deleteUser);

// Profile images & banners
router
  .route('/avatar')
  .post(protect, uploadAvatar)
  .delete(protect, deleteAvatar);
router
  .route('/banner')
  .post(protect, uploadBanner)
  .delete(protect, deleteBanner);

module.exports = router;
