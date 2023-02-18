const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth')
const {verifyToken} = require("../middleware/verifyToken");
  

router.post('/register', authController.signup);
router.post('/login', authController.login);
router.get('/profile', verifyToken, authController.getProfile);

module.exports = router;