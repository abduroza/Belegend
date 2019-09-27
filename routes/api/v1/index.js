var express = require('express')
var router = express.Router()
const usersRouter = require('./users')
const categoryRouter = require('./category')
const investorRouter = require('./investor')
const profileAthleteRouter = require('./profile_athlete')

router.use('/users', usersRouter)
router.use('/category', categoryRouter)
router.use('/investor', investorRouter)
router.use('/profile_athlete', profileAthleteRouter)

router.get('/', function (req, res, next) {
  res.render('index', { title: 'API V1' })
});

module.exports = router;
