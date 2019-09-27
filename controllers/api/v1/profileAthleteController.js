const ProfileAthlete = require('../../../models/api/v1/profile_athlete')
const Users = require('../../../models/api/v1/users')
const FuncHelpers = require('../../../helpers/response')

exports.getProfileAthlete = function(req, res, next){
    if (req.decoded.role !== 'athlete'){
        return res.status(403).json(FuncHelpers.errorResponse('Only For Athlete'))
    }

    ProfileAthlete.find({ id_user: req.decoded._id })
        .then((profile_athlete)=>{
            res.status(200).json(FuncHelpers.successResponse(profile_athlete));
        })
        .catch((err)=>{
            res.status(422).json(FuncHelpers.errorResponse(err));
        });
}

exports.deleteProfileAthlete = async (req, res)=> {
    try {
        if (req.decoded.role !== 'admin'){
            return res.status(403).json(FuncHelpers.errorResponse('Only For Admin'))
        }
    
        let id          = req.params.id; 
        let profile_athlete = await ProfileAthlete.findByIdAndRemove(id)

        let User = await Users.findById(profile_athlete.id_user)
        User.id_profile_athlete.remove(profile_athlete)
        User.save()

        res.status(200).json(FuncHelpers.successResponse("Success Deleted"));
    } catch (err) {
        res.status(422).json(FuncHelpers.errorResponse(err));
    }
}

exports.addProfileAthlete = async (req, res)=>{
    try {
        if (req.decoded.role !== 'athlete'){
            return res.status(403).json(FuncHelpers.errorResponse('Only For Athlete'))
        }

        let check_profile_investor = await ProfileAthlete.findOne({id_user: req.decoded._id}).select('id_user')
        if(check_profile_investor!==null){
            return res.status(403).json(FuncHelpers.errorResponse('Profile is exist, using edit for edit profile athlete'))
        }

        req.body['id_user'] = await req.decoded._id
        let profile_athlete = await ProfileAthlete.create(req.body)

        let User = await Users.findById(req.decoded._id)
        User.id_profile_athlete.push(profile_athlete)
        User.save()

        res.status(201).json(FuncHelpers.successResponse(profile_athlete, "Add new profile athlete success"))
    } catch (err) {
        res.status(422).json(FuncHelpers.errorResponse(err, "Wrong type"))
    }
}

exports.editProfileAthlete = function(req, res, next){  
    if (req.decoded.role !== 'athlete'){
        return res.status(403).json(FuncHelpers.errorResponse('Only For Athlete'))
    }
    req.body['id_user'] = req.decoded._id

    ProfileAthlete.findOneAndUpdate({"_id":req.params.id}, req.body)
        .then((profile_athlete)=>{
            res.status(200).json(FuncHelpers.successResponse(req.body));
        })
        .catch((err)=>{
            res.status(422).json(FuncHelpers.errorResponse(err));
        });
}