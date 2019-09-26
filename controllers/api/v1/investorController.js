const Investor = require('../../../models/api/v1/investor')
const funcHelpers = require('../../../helpers/response')
const User = require('../../../models/api/v1/users')

async function addProfile(req, res){
    try {
        if (req.decoded.role !== 'investor'){
            return res.status(403).json(funcHelpers.errorResponse("Only for Investor"))
        }
        let investor = await Investor.create(req.body)
        investor.id_user = req.decoded._id
        investor.save()

        let user = await User.findById(req.decoded._id)
        user.id_investor.push(investor)
        user.save()

        res.status(201).json(funcHelpers.successResponse(investor, "Add profile investor success "))
    } catch (err) {
        res.status(422).json(funcHelpers.errorResponse(err.message))
    }
}

async function editProfile(req, res){
    try {
        let investor = await Investor.findById(req.params.id)
        console.log(investor.id_user)
        console.log(req.decoded._id)
        if (req.decoded.role !== 'investor'){
            return res.status(403).json(funcHelpers.errorResponse('Only for investor'))
        } else if (req.decoded._id != investor.id_user){
            return res.status(403).json(funcHelpers.errorResponse('Not Your Profile'))
        }
        let data = await Investor.findByIdAndUpdate(req.params.id, {$set: req.body})

        res.status(200).json(funcHelpers.successResponse(data, 'Edit profile success'))
    } catch (err) {
        res.status(422).json(funcHelpers.errorResponse(err.message))
    }
}

async function showProfile(req, res){
    let investor = await Investor.findOne({id_user: req.decoded._id})
    res.status(200).json(funcHelpers.successResponse(investor, 'Show profile'))
}

module.exports = {addProfile, editProfile, showProfile}
