const express=require('express');

const router= express.Router();
const authController=require('../controllers/authController');








//lgoin

router.post('/login',authController.login);


module.exports=router