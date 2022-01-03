const path = require('path');

const express = require('express');
const { check, body } = require('express-validator');
const  User = require('../models/user')

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('password', 'Password has to be valid.')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  authController.postLogin
);

// router.post('/login',
// [
//   check('email')
//   .isEmail()
//   .withMessage('Please enter a valid email.')
//   .custom((value, { req }) => {
//       // if(value === 'truongthanhhung2k2@gmail.com') {
//       //     throw new Error('This email is forbidden !!')
//       // }
//       // return true;
//       return User.findOne({email: value})
//       .then(userDoc => {
//         if(!userDoc) {
//           return Promise.reject('E-mail doesnt exists already, please pick a diffirent one.');
//         }
//       })
//   }),
//   body('password', 'Please enter a password with only numbers and text at least 5 characters.')
//   .isLength({min:5})
//   .isAlphanumeric(),
// ],
// authController.postLogin);

router.post('/signup', 
[
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
        // if(value === 'truongthanhhung2k2@gmail.com') {
        //     throw new Error('This email is forbidden !!')
        // }
        // return true;
        return User.findOne({email: value})
        .then(userDoc => {
          if(userDoc) {
            return Promise.reject('E-mail exists already, please pick a diffirent one.');
          }
        })
    }),
    body('password', 'Please enter a password with only numbers and text at least 5 characters.')
    .isLength({min:5})
    .isAlphanumeric(),
    body('confirmPassword')
    .custom((value, { req }) => {
        if(value !== req.body.password) {
            throw new Error('Password have to match');
        }
        return true;
    })
],
authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;