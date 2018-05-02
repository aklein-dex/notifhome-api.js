// https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../app/models/user');
let Device = require('../app/models/device');

const bcrypt = require('bcryptjs');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../notifhome');
let should = chai.should();

chai.use(chaiHttp);


describe('Devices', () => {
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
    Device.remove({}, (err) => {
      done();
    });
  });
    
  describe('POST /devices', () => {
    it('it should create a device', (done) => {
      let device = {
          name: 'Omega2',
      }
      chai.request(server)
          .post('/devices')
          .set('access-token', token)
          .send(device)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
    });
    
    it('it should not create a device without name', (done) => {
      let device = { }
      
      chai.request(server)
          .post('/devices')
          .set('access-token', token)
          .send(device)
          .end((err, res) => {
            res.should.have.status(422);
            done();
          });
    });
  });
  
  describe('GET /devices', () => {
    it('it should get all the devices', (done) => {
      
      chai.request(server)
          .get('/devices')
          .set('access-token', token)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
    });
  });
  
  describe('GET /devices/:id', () => {
    it('it should get a device', (done) => {
      
      chai.request(server)
          .get('/devices/xxx')
          .set('access-token', token)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
    });
  });

  describe('PUT /devices/:id', () => {
    it('it should edit a device', (done) => {
      
      chai.request(server)
          .get('/devices/xxx')
          .set('access-token', token)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
    });
  });
  
  describe('DELETE /devices/:id', () => {
    it('it should get a device', (done) => {
      
      chai.request(server)
          .delete('/devices/xxx')
          .set('access-token', token)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
    });
  });

});
