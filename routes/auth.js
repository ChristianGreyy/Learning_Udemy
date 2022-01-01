const path = require('path');

const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup', 
[
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
        if(value === 'truongthanhhung2k2@gmail.com') {
            throw new Error('This email is forbidden !!')
        }
        return true;
    }),
    body('password', 'Please enter a password with only numbers and text at least 5 characters.')
    .isLength({min:5})
    .isAlphanumeric()
],
authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;