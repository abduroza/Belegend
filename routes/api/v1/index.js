var express = require('express');
var router = express.Router();
const usersRouter = require('./users');
const categoryRouter = require('./category')

router.use('/users', usersRouter);
router.use('/category', categoryRouter)

router.get('/', function (req, res, next) {
  res.render('index', { title: 'API V1' });
});

module.exports = router;
