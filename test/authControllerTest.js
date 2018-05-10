// https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../app/models/user');

const bcrypt = require('bcryptjs');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../notifhome');
let should = chai.should();

chai.use(chaiHttp);


describe('Users', () => {
  beforeEach((done) => { //Before each test we empty the database
    User.remove({}, (err) => { 
      done();
    });
  });
    
  describe('POST /auth', () => {
    it('it should register the user and return a token', (done) => {
      let user = {
          email: 'alex@gmai.com',
          name: 'alex',
          password: '12345678'
      }
      chai.request(server)
          .post('/auth')
          .send(user)
          .end((err, res) => {
            res.should.have.status(200);
            res.body['data'].should.have.property('name');
            res.should.have.header('access-token');
            done();
          });
    });
    
    it('it should not register the user if password is too short', (done) => {
      let user = {
          email: 'alex@gmai.com',
          name: 'alex',
          password: '123456'
      }
      chai.request(server)
          .post('/auth')
          .send(user)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.not.have.property('name');
            res.should.not.have.header('access-token');
            done();
          });
    });
  });
    
  describe('POST /auth/sign_in', () => {
    var password  = "12345678"
    var userAttr = {
          email: 'alex@gmai.com',
          password: password,
          name: 'alex'
      };

  
    it('it should sign in and return a token', (done) => {
      user = new User(userAttr);
      user.save(function(err) {
        if (err)
          console.log("Error while registering user: " + err);
          
        // Send "userAttr" and not "user", because user.password is now hashed
        user.password = password
        chai.request(server)
            .post('/auth/sign_in')
            .send(userAttr)
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.json;
              res.body['data'].should.have.property('name');
              res.should.have.header('access-token');
              done();
            });
      });
    });
    
    it('it should return 401 if password is invalid', (done) => {
      user = new User(userAttr);
      user.save(function(err) {
        if (err)
          console.log("Error while registering user: " + err);
          
        // Use non-encrypted password for the http request
        user.password = "abcdefg1645"
        chai.request(server)
            .post('/auth/sign_in')
            .send(user)
            .end((err, res) => {
              res.should.have.status(401);
              res.should.not.have.header('access-token');
              done();
            });
      });
    });
    
    it('it should return 401 if email is invalid', (done) => {
      user = new User(userAttr);
      user.save(function(err) {
        if (err)
          console.log("Error while registering user: " + err);
          
        // Use non-encrypted password for the http request
        user.email = "hello@gmail.com"
        chai.request(server)
            .post('/auth/sign_in')
            .send(user)
            .end((err, res) => {
              res.should.have.status(401);
              res.should.not.have.header('access-token');
              done();
            });
      });
    });
  });

});
