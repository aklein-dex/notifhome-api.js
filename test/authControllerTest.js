// https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../app/models/user');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../notifhome');
let should = chai.should();

chai.use(chaiHttp);

//Our parent block
describe('Users', () => {
  beforeEach((done) => { //Before each test we empty the database
    User.remove({}, (err) => { 
      done();         
    });
  });
    
  describe('POST /auth/signin', () => {
    it('it should sign in and return a token', (done) => {
      let user = {
          email: 'alex@gmai.com',
          password: '123456'
      }
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
