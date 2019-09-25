var FuncHelpers     = require('../../../helpers/response');
var Users           = require('../../../models/api/v1/users');
const jwt           = require('jsonwebtoken');
const bcrypt        = require('bcryptjs');
const env           = require('dotenv').config();
const saltRounds    = 10;

exports.getUsers = function(req, res, next){
    Users.find().exec()
        .then((users)=>{
            res.status(200).json(FuncHelpers.successResponse(users));
        })
        .catch((err)=>{
            res.status(422).json(FuncHelpers.errorResponse(err));
        });
}

exports.forgotPassword = function(req, res, next){
    Users.findOne({ email: req.body.email }, 'email, _id').exec()
        .then((users)=>{

            var token       = FuncHelpers.randToken();
            var exp_token   = new Date(new Date().setHours(new Date().getHours() + 6));

            var email_to        = req.body.email;
            var email_from      = 'aku@todoglint.com';
            var subject         = 'Change password todoglint.com';

            var link            = "http://"+req.get('host')+"/api/v1/users/change_password/"+users._id+"/"+token;
            var html            = 'Plese click link bellow, if you want to reset and change your password<br>';
                html            += '<br><strong><a href='+link+'>'+link+'</a></strong>';
                html            += '<br><br>Thanks';

            FuncHelpers.sendMail(email_to, email_from, subject, html);

            var update_token = {
                token: token,
                exp_token : exp_token
            } 
            Users.findOneAndUpdate({_id: users._id}, update_token)
                .then((users)=>{
                    res.status(200).json(FuncHelpers.successResponse("Success send email for reset password"));
                })
                .catch((err)=>{
                    res.status(422).json(err);
                });
        })
        .catch((err)=>{
            res.status(422).json(err);
        });
}

exports.resetPassword = function(req, res, next){
    let id          = req.body.id;
    let token       = req.body.token;
    let password    = req.body.password;

    Users.findOneAndUpdate({"_id":id, "token":token}, { password: password }).exec()
        .then((users)=>{
            res.status(200).json(FuncHelpers.successResponse(users));
        })
        .catch((err)=>{
            res.status(422).json(FuncHelpers.errorResponse(err));
        });
}

exports.resendEmail = function(req, res, next){
    var token       = FuncHelpers.randToken();
    var exp_token   = new Date(new Date().setHours(new Date().getHours() + 6));

    Users.findOne({ email: req.body.email }, '_id').exec()
        .then((users)=>{

            var email_to        = req.body.email;
            var email_from      = 'aku@todoglint.com';
            var subject         = 'Verify your main in Todo-glint';

            var link            = "http://"+req.get('host')+"/api/v1/users/verify/"+token;
            var html            = 'Plese click link bellow, if you register at todoglint.com<br>';
                html            += '<br><strong><a href='+link+'>'+link+'</a></strong>';
                html            += '<br><br>Thanks';

            FuncHelpers.sendMail(email_to, email_from, subject, html);
            
            Users.findOneAndUpdate({_id: users._id}, { is_verified: false, exp_token: exp_token, token: token})
                .then((users)=>{
                    res.status(200).json(FuncHelpers.successResponse("Success resend token"));
                })
                .catch((err)=>{
                    res.status(422).json(err);
                });

        })
        .catch((err)=>{
            res.status(422).json(err);
        });
}

exports.insertUsers = function(req, res, next){
    var email_token = FuncHelpers.randToken();
    var hash = bcrypt.hashSync(req.body.password, saltRounds)

    req.body['email_token']             = email_token
    req.body['exp_token']               = new Date(new Date().setHours(new Date().getHours() + 6))
    req.body['password']                = hash
    req.body['image']                   = 'https://api.adorable.io/avatars/285/'+req.body.email

    Users.create(req.body)
        .then((users) => {
            
            var email_to        = req.body.email;
            var email_from      = 'admin@belegend.com';
            var subject         = 'Verify your mail in BeLegend';

            var link            = "http://"+req.get('host')+"/api/v1/users/verify/"+email_token;
            var html            = 'Plese click link bellow, if you register at BeLegend.com<br>';
                html            += '<br><strong><a href='+link+'>'+link+'</a></strong>';
                html            += '<br><br>Thanks';

            FuncHelpers.sendMail(email_to, email_from, subject, html)

            let jwt_token = jwt.sign(users.toJSON(), process.env.SECRET_KEY, { 
                algorithm: 'HS256',
                expiresIn: '1d'
            })

            let result = {
                _id          : users._id,
                role         : users.role,
                image        : users.image,
                token        : jwt_token
            }

            res.status(201).json(FuncHelpers.successResponse(result))
        })
        .catch((err) => {
            res.status(422).json(FuncHelpers.errorResponse(err))
        })
}

exports.usersVerifyEmail = function(req, res, next){  
    let token = req.params.token;

    Users.findOne({ token: token }, 'exp_token').exec()
        .then((users)=>{
            if(Date.now()<users.exp_token){

                Users.findOneAndUpdate({token: token}, { is_verified: true})
                .then((users)=>{
                    res.status(200).json(FuncHelpers.successResponse("Success verified your users"));
                })
                .catch((err)=>{
                    res.status(422).json(err);
                });
        
            }else{
                res.status(422).json(FuncHelpers.errorResponse('Time token validations is expired, please resend email confirm'))
            }
        })
        .catch((err)=>{
            res.status(422).json(err);
        });
}

exports.usersUpdate = function(req, res, next){  
    let id          = req.params.id;
    var hash        = bcrypt.hashSync(req.body.password, saltRounds)
    req.body['password']    = hash

    Users.findOneAndUpdate({"_id":id}, req.body).exec()
        .then((users)=>{
            res.status(200).json(FuncHelpers.successResponse(users));
        })
        .catch((err)=>{
            res.status(422).json(FuncHelpers.errorResponse(err));
        });
}

exports.usersDelete = function(req, res) {
    let id          = req.params.id; 
    Users.findByIdAndRemove(id).exec()
        .then((users)=>{
            res.status(200).json(FuncHelpers.successResponse(users));
        })
        .catch((err)=>{
            res.status(422).json(FuncHelpers.errorResponse(err));
        });
}

exports.usersAuth = (req, res, next) => {
    
    Users.findOne({"email": req.body.email.toLowerCase()})
        .then((users)=>{
            if(users!=null){
                bcrypt.compare(req.body.password, users.password).then(function (result) {
                    if (result) {

                        var token = jwt.sign(users.toJSON(), process.env.SECRET_KEY, { 
                            algorithm: 'HS256',
                            expiresIn: '1d'
                        });

                        res.status(200).json(FuncHelpers.successResponse(token))
                    } else {
                        res.status(401).send(FuncHelpers.errorResponse("Username or Password is wrong"))
                    }
                }).catch((err) => { return next(err) })
            }else{
                res.status(401).send(FuncHelpers.errorResponse("Username or Password not exist"));
            }
        })
        .catch((err)=>{
            res.status(422).send(FuncHelpers.errorResponse("Can't login"));
        });

}






