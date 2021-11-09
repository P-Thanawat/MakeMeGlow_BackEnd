const { User, Cart, CreditCard, ResetPassword } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isEmail, isStrongPassword } = require('validator');
const omise = require('omise')({ secretKey: 'skey_test_5ov8h8rdpslf54x97k1' });
const Customerror = require('../util/error');
const cloundinaryUploadPromise = require('../util/upload');
const { cryptotypePromise } = require('../util/cryptotype');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.auth_user,
    pass: process.env.auth_pass,
  },
});

const createCartAndCreditCardOmise = async (userCreate) => {
  // Create Cart when user registed
  await Cart.create({ userId: userCreate.id });

  //create customer id in omise
  omise.customers.create(
    {
      description: `${userCreate.firstName + ' ' + userCreate.lastName} (id: ${userCreate.id})`,
      email: userCreate.email,
    },
    async function (error, customer) {
      if (error) {
        throw new Customerror(error.message, 400);
      } else {
        try {
          await CreditCard.create({ customerId: customer.id, userId: userCreate.id });
        } catch (err) {
          next(err);
        }
      }
    }
  );
};

exports.register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  if ([firstName, lastName, email, password].includes(undefined)) {
    return res.status(400).json({ message: 'firstName, lastName, email and password is require!!' });
  }

  if (
    !isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    return res.status(400).json({ message: 'password is week!!' });
  }

  try {
    const user = await User.findOne({
      where: { email: email, facebookId: null, googleId: null },
    });

    if (user) {
      res.status(400).json({ message: 'Email Already in Use.' });
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      const userCreate = await User.create({
        firstName,
        lastName,
        email,
        imageUrl: null,
        password: hashedPassword,
        googleId: null,
        facebookId: null,
      });

      await createCartAndCreditCardOmise(userCreate);

      res.status(201).json({ message: 'User has been created' });
    }
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if ([email, password].includes(undefined)) {
      return res.status(400).json({ massage: 'email and password is require!!' });
    }

    if (!isEmail(email)) {
      return res.status(400).json({
        message: 'email  is invalid format',
      });
    }

    const user = await User.findOne({
      where: { email: email, facebookId: null, googleId: null },
    });

    if (user) {
      const isCorrectPassword = await bcrypt.compare(password, user.password);
      if (isCorrectPassword) {
        const payload = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          image: user.imageUrl,
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: process.env.TOKEN_EXPIRE,
        });
        res.status(200).json({ message: 'Success login', token });
      } else {
        res.status(400).json({
          message: 'email or password is incorrect',
        });
      }
    } else {
      res.status(400).json({
        message: 'email or password is incorrect',
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.loginWithGoogle = async (req, res, next) => {
  try {
    const { email, firstName, lastName, googleId, imageUrl } = req.body;

    if ([firstName, lastName, email, googleId].includes(undefined)) {
      return res.status(400).json({ message: 'firstName, lastName, email and googleId is require!!' });
    }

    const user = await User.findOne({ where: { email, googleId } });

    if (user) {
      const payload = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        image: user.imageUrl,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRE });
      res.status(200).json({ message: 'Success login', token });
    } else {
      const userCreate = await User.create({
        firstName,
        lastName,
        email,
        imageUrl: imageUrl,
        password: null,
        facebookId: null,
        googleId: googleId,
      });

      await createCartAndCreditCardOmise(userCreate);

      const payload = {
        id: userCreate.id,
        email: userCreate.email,
        firstName: userCreate.firstName,
        lastName: userCreate.lastName,
        role: userCreate.role,
        image: userCreate.imageUrl,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRE });
      res.status(200).json({ message: 'Success login', token });
    }
  } catch (err) {
    next(err);
  }
};

exports.loginWithFacebook = async (req, res, next) => {
  try {
    const { email, firstName, lastName, facebookId, imageUrl } = req.body;

    if ([firstName, lastName, email, facebookId].includes(undefined)) {
      return res.status(400).json({ message: 'firstName, lastName, email and facebookId is require!!' });
    }

    const user = await User.findOne({ where: { email, facebookId } });

    if (user) {
      const payload = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        image: user.imageUrl,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRE });
      res.status(200).json({ message: 'Success login', token });
    } else {
      const userCreate = await User.create({
        firstName,
        lastName,
        email,
        imageUrl: imageUrl,
        password: null,
        googleId: null,
        facebookId: facebookId,
      });

      await createCartAndCreditCardOmise(userCreate);

      const payload = {
        id: userCreate.id,
        email: userCreate.email,
        firstName: userCreate.firstName,
        lastName: userCreate.lastName,
        role: userCreate.role,
        image: userCreate.imageUrl,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRE });
      res.status(200).json({ message: 'Success login', token });
    }
  } catch (err) {
    next(err);
  }
};

exports.editUserInformation = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber } = req.body;
    const result = req.file && (await cloundinaryUploadPromise(req.file.path));
    const rows = await User.update(
      {
        firstName,
        lastName,
        email,
        phoneNumber,
        imageUrl: result?.secure_url,
      },
      {
        where: {
          id: req.user.id,
        },
      }
    );

    if (rows === 0) {
      return res.status(400).json({ message: 'Update is failed' });
    }

    res.json({ message: 'Updated is Successful' });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: {
        id,
      },
      attributes: ['firstName', 'lastName', 'email', 'imageUrl', 'phoneNumber', 'gender', 'id'],
    });

    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email: email, googleId: null, facebookId: null } });

    if (!user) {
      return res.status(400).json({ message: "User don't exist with that email!!" });
    }

    const resetPassword = await ResetPassword.findOne({ where: { userId: user.id } });

    const resetToken = await cryptotypePromise();
    const expireToken = Date.now() + 20 * 60 * 1000;

    if (resetPassword) {
      resetPassword.resetToken = resetToken;
      resetPassword.expireToken = expireToken;
      resetPassword.save();
    } else {
      await ResetPassword.create({ userId: user.id, resetToken, expireToken });
    }

    let info = await transporter.sendMail({
      from: process.env.auth_user,
      to: email,
      subject: 'Reset Password',
      // text: `${process.env.CLIENT_URL}/reset_password/${resetToken}`,
      html: `
      <!doctype html>
      <html lang="en-US">
      
      <head>
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
          <title>Reset Password Email Template</title>
          <meta name="description" content="Reset Password Email Template.">
          <style type="text/css">
              a:hover {text-decoration: underline !important;}
          </style>
      </head>
      
      <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
          <!--100% body table-->
          <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
              style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
              <tr>
                  <td>
                      <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                          align="center" cellpadding="0" cellspacing="0">
                          <tr>
                              <td style="height:80px;">&nbsp;</td>
                          </tr>
                          <tr>
                              <td style="text-align:center;">
                                <a href="http://localhost:3000" title="logo" target="_blank">
                                <svg width="450" height="54" viewBox="0 0 533 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M0.816 1.592V53H10.32V11.96H10.464L19.608 53H27.672L36.816 11.96H36.96V53H46.464V1.592H31.128L23.712 37.88H23.568L16.224 1.592H0.816ZM82.5529 33.632L77.5849 10.52H77.4409L72.4729 33.632H82.5529ZM83.9209 1.592L97.5289 53H86.7289L84.3529 42.128H70.6729L68.2969 53H57.4969L71.1049 1.592H83.9209ZM118.673 1.592H108.305V53H118.673V37.736L122.489 31.904L133.073 53H144.737L129.185 23.624L143.153 1.592H131.921L118.817 22.184H118.673V1.592ZM182.905 1.592H154.177V53H183.625V44.504H164.545V30.68H181.825V22.184H164.545V10.088H182.905V1.592ZM220.754 1.592V53H230.258V11.96H230.402L239.546 53H247.61L256.754 11.96H256.898V53H266.402V1.592H251.066L243.65 37.88H243.506L236.162 1.592H220.754ZM309.762 1.592H281.034V53H310.482V44.504H291.402V30.68H308.682V22.184H291.402V10.088H309.762V1.592ZM370.219 16.856H380.155C380.155 11.624 378.907 7.616 376.411 4.832C373.915 2 369.835 0.583997 364.171 0.583997C360.859 0.583997 358.099 1.136 355.891 2.24C353.683 3.344 351.907 5 350.563 7.208C349.219 9.368 348.259 12.08 347.683 15.344C347.155 18.608 346.891 22.4 346.891 26.72C346.891 31.184 347.083 35.12 347.467 38.528C347.851 41.888 348.595 44.72 349.699 47.024C350.851 49.328 352.411 51.032 354.379 52.136C356.395 53.24 358.987 53.792 362.155 53.792C364.603 53.792 366.691 53.384 368.419 52.568C370.195 51.704 371.707 50.264 372.955 48.248H373.099V53H380.731V25.28H363.955V32.912H370.795V38.168C370.795 39.56 370.579 40.784 370.147 41.84C369.715 42.848 369.163 43.688 368.491 44.36C367.867 45.032 367.171 45.536 366.403 45.872C365.683 46.208 365.011 46.376 364.387 46.376C362.899 46.376 361.675 45.92 360.715 45.008C359.803 44.048 359.083 42.704 358.555 40.976C358.075 39.2 357.739 37.064 357.547 34.568C357.355 32.072 357.259 29.288 357.259 26.216C357.259 19.784 357.811 15.176 358.915 12.392C360.019 9.608 361.819 8.216 364.315 8.216C365.371 8.216 366.259 8.504 366.979 9.08C367.747 9.608 368.371 10.304 368.851 11.168C369.331 11.984 369.667 12.896 369.859 13.904C370.099 14.912 370.219 15.896 370.219 16.856ZM394.603 53H423.331V44.504H404.971V1.592H394.603V53ZM444.419 27.296C444.419 23.84 444.491 20.912 444.635 18.512C444.827 16.112 445.163 14.144 445.643 12.608C446.171 11.072 446.891 9.968 447.803 9.296C448.763 8.576 450.011 8.216 451.547 8.216C453.083 8.216 454.307 8.576 455.219 9.296C456.179 9.968 456.899 11.072 457.379 12.608C457.907 14.144 458.243 16.112 458.387 18.512C458.579 20.912 458.675 23.84 458.675 27.296C458.675 30.752 458.579 33.704 458.387 36.152C458.243 38.552 457.907 40.52 457.379 42.056C456.899 43.544 456.179 44.648 455.219 45.368C454.307 46.04 453.083 46.376 451.547 46.376C450.011 46.376 448.763 46.04 447.803 45.368C446.891 44.648 446.171 43.544 445.643 42.056C445.163 40.52 444.827 38.552 444.635 36.152C444.491 33.704 444.419 30.752 444.419 27.296ZM434.051 27.296C434.051 31.232 434.219 34.832 434.555 38.096C434.939 41.36 435.731 44.168 436.931 46.52C438.179 48.872 439.955 50.672 442.259 51.92C444.563 53.168 447.659 53.792 451.547 53.792C455.435 53.792 458.531 53.168 460.835 51.92C463.139 50.672 464.891 48.872 466.091 46.52C467.339 44.168 468.131 41.36 468.467 38.096C468.851 34.832 469.043 31.232 469.043 27.296C469.043 23.408 468.851 19.832 468.467 16.568C468.131 13.256 467.339 10.424 466.091 8.072C464.891 5.72 463.139 3.896 460.835 2.6C458.531 1.256 455.435 0.583997 451.547 0.583997C447.659 0.583997 444.563 1.256 442.259 2.6C439.955 3.896 438.179 5.72 436.931 8.072C435.731 10.424 434.939 13.256 434.555 16.568C434.219 19.832 434.051 23.408 434.051 27.296ZM479.315 1.592L488.675 53H500.267L506.027 15.704H506.171L511.931 53H523.523L532.883 1.592H522.947L517.259 39.608H517.115L511.067 1.592H501.131L495.083 39.608H494.939L489.251 1.592H479.315Z"
                                  fill="black"
                                />
                              </svg>
                                </a>
                              </td>
                          </tr>
                          <tr>
                              <td style="height:20px;">&nbsp;</td>
                          </tr>
                          <tr>
                              <td>
                                  <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                      style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                      <tr>
                                          <td style="height:40px;">&nbsp;</td>
                                      </tr>
                                      <tr>
                                          <td style="padding:0 35px;">
                                              <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                  requested to reset your password</h1>
                                              <span
                                                  style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                              <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                  We cannot simply send you your old password. A unique link to reset your
                                                  password has been generated for you. To reset your password, click the
                                                  following link and follow the instructions.
                                              </p>
                                              <a href="${process.env.CLIENT_URL}/reset_password/${resetToken}"
                                                  style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                                  Password</a>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style="height:40px;">&nbsp;</td>
                                      </tr>
                                  </table>
                              </td>
                          <tr>
                              <td style="height:20px;">&nbsp;</td>
                          </tr>
                          <tr>
                              <td style="text-align:center;">
                                  <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>MAKE ME GLOW</strong></p>
                              </td>
                          </tr>
                          <tr>
                              <td style="height:80px;">&nbsp;</td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
          <!--/100% body table-->
      </body>
      
      </html>`,
    });

    res.json({ message: 'Send reset password url to email.' });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { newPassword, confirmNewPassword, resetToken } = req.body;
    const resetPassword = await ResetPassword.findOne({ where: { resetToken: resetToken } });

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwor dosen't match!!" });
    }

    if (!resetPassword) {
      return res.status(400).json({ message: "Token is don't have in table" });
    }

    const now = Date.now();

    if (now > resetPassword.expireToken) {
      return res.status(400).json({ message: 'Token is expire!!' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.update(
      {
        password: hashedPassword,
      },
      { where: { id: resetPassword.userId } }
    );

    await ResetPassword.destroy({ where: { resetToken: resetToken } });

    res.json({ message: 'Update password successful!!' });
  } catch (err) {
    next(err);
  }
};
