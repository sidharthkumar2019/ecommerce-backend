const express = require('express');
const { requireSignin, adminMiddleware } = require('../../common-moddleware');
const { initalData } = require('../../controller/admin/initialData');
const router = express.Router();

router.get('/initialdata',requireSignin, adminMiddleware, initalData);

module.exports = router;