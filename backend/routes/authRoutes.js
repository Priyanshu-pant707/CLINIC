const express = require('express');


const router = express.Router();
const authController = require('../controllers/authController');








//lgoin

router.post('/login', authController.login);


//signup


router.post('/signup', authController.signUp);

module.exports = router;