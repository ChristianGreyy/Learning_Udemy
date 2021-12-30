const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const passwordEmail = require('../private').passwordEmail;

const User = require('../models/user');

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'christiangrey2k2@gmail.com', // generated ethereal user
    pass: passwordEmail, // generated ethereal password
  },
});

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    errorMessage: message 
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email: email})
    .then(user => {
      if(!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      bcrypt.compare(password, user.password)
      .then(doMatch => {
        if(doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
            console.log(err);
            res.redirect('/');
          });
        }
        req.flash('error', 'Invalid email or password.');

        res.redirect('/login');
      })
      .catch(err => {
        console.log(err);
        res.redirect('/login');
      })
      
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  console.log(email, password, confirmPassword);

  User.findOne({email: email})
  .then(userDoc => {
    if(userDoc) {
      req.flash('error', 'E-mail exists already, please pick a diffirent one.');
      return res.redirect('/signup');
    }
    return bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] }
      })
      return user.save();
    })
    .then(result => {
      res.redirect('/login');
      return transporter.sendMail({
        from: 'christiangrey2k2@gmail.com', // sender address
        to: "truongthanhhung2k2@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      }, (error, info) => {
        if(error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      })
    })
    .catch(err => {
      console.log('error')
      console.log(err);
    })
  })
  .catch(err => {
    console.log(err);
  })
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: 'reset', 
    pageTitle: 'Reset Password',
    errorMessage: message,
  })
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if(err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');

    User.findOne({email: req.body.email})
    .then(user => {
      if(!user) {
        res.flash('error', 'No account with that email found');
        res.redirect('/reset');

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save(); 
      }
    })
    .then(result => {
      console.log('success');
    })
    .catch(err => {
      console.log(err);
    })
  });
}