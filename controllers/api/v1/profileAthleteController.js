const ProfileAthlete = require('../../../models/api/v1/profile_athlete')
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

exports.deleteProfileAthlete = function(req, res) {
    if (req.decoded.role !== 'admin'){
        return res.status(403).json(FuncHelpers.errorResponse('Only For Admin'))
    }

    let id          = req.params.id; 
    ProfileAthlete.findByIdAndRemove(id).exec()
        .then((profile_athlete)=>{
            res.status(200).json(FuncHelpers.successResponse("Success Deleted"));
        })
        .catch((err)=>{
            res.status(422).json(FuncHelpers.errorResponse(err));
        });
}

exports.addProfileAthlete = async (req, res)=>{
    try {
        if (req.decoded.role !== 'athlete'){
            return res.status(403).json(FuncHelpers.errorResponse('Only For Athlete'))
        }
        req.body['id_user'] = await req.decoded._id

        let profile_athlete = await ProfileAthlete.create(req.body)
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