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
    it('it should sign in and return a token', (done) => {
      var password = bcrypt.hashSync("123456", 8)
      
      // Create a user, make sure the password is encrypted
      var user = new User({
          email: 'alex@gmai.com',
          password: password,
          username: 'alex',
          token: 'abcd'
      });
      user.save(function(err) {
        if (err)
          console.log("Error while registering user: " + err);
          
        // Use non-encrypted password for the http request
        user.password = "123456"
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
  });

});
