const express = require('express');
const { initalData } = require('../../controller/admin/initialData');
const router = express.Router();

router.get('/initialdata', initalData);

module.exports = router;