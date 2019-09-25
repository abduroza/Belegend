var express = require('express');
var router = express.Router();
const usersRouter = require('./users');


router.use('/users', usersRouter);

router.get('/', function (req, res, next) {
  res.render('index', { title: 'API V1' });
});

module.exports = router;
