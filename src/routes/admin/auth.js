const express = require('express');
const { signup, signin } = require('../../controller/admin/auth');
const {validateSignupResult, validateSigninResult, isRequestValidated} = require('../../validators/auth');
const router = express.Router();

router.post('/admin/signin', validateSigninResult, isRequestValidated, signin);
router.post('/admin/signup', validateSignupResult, isRequestValidated, signup);

module.exports = router;