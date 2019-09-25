let mongoose = require("mongoose");
let Users = require("../../models/api/v1/users");

var app = require('../../app');
const faker = require('faker');
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var should = chai.should;

chai.use(chaiHttp);

var token = '';

var user_merchant =  {
    username        : 'mercant1',
    email           : faker.internet.email(),
    password        : 'mercant1',
    first_name      : faker.name.firstName(),
    last_name       : faker.name.lastName(),
    user_type       : 'merchant'
}

var user_merchant_login =  {
    username        : 'mercant1',
    password        : 'mercant1'
}

var user_merchant2 =  {
    username        : 'mercant2',
    email           : faker.internet.email(),
    password        : 'mercant2',
    first_name      : faker.name.firstName(),
    last_name       : faker.name.lastName(),
    user_type       : 'merchant'
}

var user_merchant2_login =  {
    username        : 'mercant2',
    password        : 'mercant2'
}

var user_customer =  {
    username        : 'customer1',
    email           : faker.internet.email(),
    password        : 'customer1',
    first_name      : faker.name.firstName(),
    last_name       : faker.name.lastName(),
    user_type       : 'customer'
}

describe('Users', () => {

    beforeEach((done)=>{
        Users.deleteMany({}, (err) => {
            done();
        });
    });

    beforeEach((done)=>{
        chai.request(app)
            .post('/api/v1/users')
            .send(user_merchant2)
            .end(function (err, data) {
                result_register = data
                done()
            })
    })
    
    beforeEach(done => {
        chai.request(app)
            .post('/api/v1/users/auth')
            .send(user_merchant2_login)
            .end(function (err, res) {
                token = res.body.token
                done()
            })
    })

    describe('/POST users', () => {
        
        it('it should POST mercant succcess', (done) => {
            chai.request(app)
                .post('/api/v1/users')
                .send(user_merchant)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res).to.be.a('object');

                    done();
                });
        });

        it('it should POST customer succcess', (done) => {
            chai.request(app)
                .post('/api/v1/users')
                .send(user_customer)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res).to.be.a('object');

                    done();
                });
        });

        it('it should POST for auth login', (done) => {
            chai.request(app)
                .post('/api/v1/users/auth')
                .send(user_merchant2_login)
                .end((err, res) => {
                    token = res.body.token

                    expect(res).to.have.status(200);
                    expect(res).to.be.a('object');

                    done();
                });
        });

        it('it should POST for resend email', (done) => {
            var user = {
                username        : 'mercant1',
                email           : faker.internet.email(),
                password        : 'mercant1',
                first_name      : faker.name.firstName(),
                last_name       : faker.name.lastName(),
                user_type       : 'merchant'
            }
            var user_merchant_resend  =  new Users(user)

            user_merchant_resend.save((err, users) => {
                chai.request(app)
                    .post('/api/v1/users/resend_email')
                    .send(user)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('object');

                        done();
                    });
            })
        });

        it('it should POST for forgot password', (done) => {

            chai.request(app)
                .post('/api/v1/users')
                .send(user_merchant)
                .end((err, res) => {

                    chai.request(app)
                        .post('/api/v1/users/forgot_password')
                        .send(user_merchant)
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res).to.be.a('object');

                            done();
                        });

                });

        });

        it('it should POST for resend email', (done) => {

            chai.request(app)
                .post('/api/v1/users')
                .send(user_merchant)
                .end((err, res) => {

                    chai.request(app)
                        .post('/api/v1/users/resend_email')
                        .send(user_merchant)
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res).to.be.a('object');

                            done();
                        });

                });

        });

    });

    describe('/GET users', () => {
        it('it should GET all the todo', (done) => {
            chai.request(app)
                .get('/api/v1/users')
                .set('authorization', token)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.a('object');

                    done();
                });
        });
    });

    describe('/PUT/:id users', () => {
        it('should update a users by single id', function(done) {
            var user_merchant_put  =  new Users({
                username        : 'mercant1',
                email           : 'mailooooooo@mail.com',
                password        : 'mercant1',
                first_name      : faker.name.firstName(),
                last_name       : faker.name.lastName(),
                user_type       : 'merchant'
            })

            chai.request(app)
                .post('/api/v1/users')
                .send(user_merchant_put)
                .end((err, users) => {

                    chai.request(app)
                        .put('/api/v1/users/' + users.body.results._id)
                        .send(user_merchant_put)
                        .set('authorization', token)
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res.body).to.be.a('object');

                            done();
                        });
            
            })

        });
    });

    describe('/DELETE/:id users', () => {
        it('should delete a user by single id', function(done) {
            var user_merchant_delete  =  new Users({
                username        : 'mercant1',
                email           : faker.internet.email(),
                password        : 'mercant1',
                first_name      : faker.name.firstName(),
                last_name       : faker.name.lastName(),
                user_type       : 'merchant'
            })

            user_merchant_delete.save((err, users) => {
                chai.request(app)
                    .delete('/api/v1/users/' + users.id)
                    .set('authorization', token)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('object');

                        done();
                    });
            })
        });

        it('should delete a user by wrong single id', function(done) {

            chai.request(app)
                    .delete('/api/v1/users/dfasdfasf')
                    .set('authorization', token)
                    .end((err, res) => {
                        expect(res).to.have.status(422);
                        expect(res.body).to.be.a('object');

                        done();
                    });

        });
    });

});