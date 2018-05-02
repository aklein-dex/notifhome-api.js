// https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../app/models/user');
let Device = require('../app/models/device');
let Notification = require('../app/models/notification');

const bcrypt = require('bcryptjs');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../notifhome');
let should = chai.should();

chai.use(chaiHttp);


describe('Notifications', () => {
  var password  = "123456"
  var hashedPwd = bcrypt.hashSync("123456", 8)
  var token = "abcdef123"
  
  before((done) => {
    // Create a user
    user = new User({
      email: 'alex@gmai.com',
      password: hashedPwd,
      username: 'alex',
      token: token
    });
    user.save(function(err) {
      if (err)
        console.log("Error while registering user: " + err);
    
      done();
    });
  });
  
  beforeEach((done) => { 
    //Before each test we empty the database
    Notification.remove({}, (err) => {
      done();
    });
  });
    
  describe('POST /notifications', () => {
    it('it should create a notification', (done) => {
      let notification = {
          message: 'Hello you',
      }
      chai.request(server)
          .post('/notifications')
          .set('access-token', token)
          .send(notification)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
    });
    
    it('it should not create a notification without a message', (done) => {
      let notification = { }
      
      chai.request(server)
          .post('/notifications')
          .set('access-token', token)
          .send(notification)
          .end((err, res) => {
            res.should.have.status(422);
            done();
          });
    });
  });
  
  describe('GET /notifications', () => {
    it('it should get all the notifications', (done) => {
      
      chai.request(server)
          .get('/notifications')
          .set('access-token', token)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
    });
  });
  
  
});
