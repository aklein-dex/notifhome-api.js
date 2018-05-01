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
    
  describe('POST /auth/signup', () => {
    it('it should register the user and return a token', (done) => {
      let user = {
          email: 'alex@gmai.com',
          username: 'alex',
          password: '123456'
      }
      chai.request(server)
          .post('/auth/signup')
          .send(user)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('token');
            done();
          });
    });
  });
    
  describe('POST /auth/signin', () => {
    var password  = "123456"
    var hashedPwd = bcrypt.hashSync("123456", 8)
    var userAttr = {
          email: 'alex@gmai.com',
          password: hashedPwd,
          username: 'alex',
          token: 'abcd'
      };

  
    it('it should sign in and return a token', (done) => {
      user = new User(userAttr);
      user.save(function(err) {
        if (err)
          console.log("Error while registering user: " + err);
          
        // Use non-encrypted password for the http request
        user.password = password
        chai.request(server)
            .post('/auth/signin')
            .send(user)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property('token');
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
        user.password = "abcdefg1"
        chai.request(server)
            .post('/auth/signin')
            .send(user)
            .end((err, res) => {
              res.should.have.status(401);
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
            .post('/auth/signin')
            .send(user)
            .end((err, res) => {
              res.should.have.status(404);
              done();
            });
      });
    });
  });

});
