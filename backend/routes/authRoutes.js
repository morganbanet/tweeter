const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  userProfile,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(protect, logoutUser);
router.route('/profile').get(protect, userProfile);
router.route('/updatedetails').patch(protect, updateDetails);
router.route('/updatepassword').put(protect, updatePassword);
router.route('/forgotpassword').put(forgotPassword);
router.route('/resetpassword/:resettoken').put(resetPassword);

module.exports = router;
