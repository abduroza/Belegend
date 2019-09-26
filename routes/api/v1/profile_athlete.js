var router = require('express').Router()
var auth = require('../../../middleware/auth')
var profileAthleteController = require('../../../controllers/api/v1/profileAthleteController')

router.post('/', auth.isAuthenticated, profileAthleteController.addProfileAthlete)
    .get('/', auth.isAuthenticated, profileAthleteController.getProfileAthlete)
router.put('/:id', auth.isAuthenticated, profileAthleteController.editProfileAthlete)
    .delete('/:id', auth.isAuthenticated, profileAthleteController.deleteProfileAthlete)

module.exports = router;