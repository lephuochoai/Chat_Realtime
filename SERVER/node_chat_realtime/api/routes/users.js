const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');


router.post('/sign-up', controller.signUp);
router.post('/login', controller.login);
router.post('/check', controller.checkID)

module.exports = router;
