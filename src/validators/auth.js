const { body, validationResult } = require("express-validator");

exports.validateSignupResult = [
    body('firstName').notEmpty().withMessage('First name is required.'),
    body('lastName').notEmpty().withMessage('Last name is required.'),
    body('email').isEmail().withMessage('Valid email required.'),
    body('password').isLength({min: 6}).withMessage('Password must be atleast 6 characters long.')
];

exports.validateSigninResult = [
  body('email').isEmail().withMessage('Valid email required.'),
  body('password').isLength({min: 6}).withMessage('Password must be atleast 6 characters long.')
];


exports.isRequestValidated = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    next();
};