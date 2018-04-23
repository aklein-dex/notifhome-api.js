const express = require('express')
var router = express.Router();

const bodyParser = require('body-parser')

const { check, validationResult } = require('express-validator/check')
const { matchedData, sanitize } = require('express-validator/filter')


const mongojs = require('mongojs')
const db = mongojs('notifhome', ['users'])


const tokenMiddleware = require('../../middlewares/token');


router.get('/notification', tokenMiddleware.hasValidToken, (req, res) => {
});


module.exports = router;
