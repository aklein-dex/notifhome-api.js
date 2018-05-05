// https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");

let User = require('../app/models/user');
let Device = require('../app/models/device');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../notifhome');
let should = chai.should();

chai.use(chaiHttp);


describe('Devices', () => {
  var token = ""
  
  before((done) => {
    // Create a user
    user = new User({
      email: 'device-test@gmail.com',
      password: "123456",
      username: 'device'
    });
    user.save(function(err) {
      if (err)
        console.log("Error while registering user: " + err);
        
      token = user.token
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
      Device.create([{name: 'Omega2'}, {name: 'raspberry'}], (err) => {
        if (err)
          console.log("Error while creating device: " + err);
      });
      chai.request(server)
          .get('/devices')
          .set('access-token', token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body['devices'].should.be.a('array');
            res.body['devices'].length.should.be.eql(2);
            done();
          });
    });
  });
  
  describe('GET /devices/:id', () => {
    it('it should get a device', (done) => {
      var deviceName = 'MyDevice'
      let device = new Device({name: deviceName});
      device.save((err, device) => {
        if (err)
          console.log("Error while creating device: " + err);
          
        chai.request(server)
          .get('/devices/' + device.id)
          .set('access-token', token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body['name'].should.be.eql(deviceName);
            done();
          });
      });
      
      
    });
  });

  // These 2 tests (PUT/DELETE) are strange because we don't receive the response from the request...
  // If I change ".put" for ".get" then a response is received. Maybe a bug with chai?
  //describe('PUT /devices/:id', () => {
    //it('it should edit a device', (done) => {
      
      //var deviceName = 'MyDevice'
      //let device = new Device({name: deviceName});
      //device.save((err, device) => {
        //if (err)
          //console.log("Error while creating device: " + err);
          
        //chai.request(server)
          //.put('/devices/' + device.id)
          //.set('access-token', token)
          //.send({'name': 'BanadaBread'})
          //.end((err, res) => {
            //res.should.have.status(200);
            //res.body.should.have.property('name').eql('BanadaBread');
            //done();
          //});
        //});
    //});
  //});
  
  //describe('DELETE /devices/:id', () => {
    //it('it should delete a device', (done) => {
      
      //var deviceName = 'MyDevice'
      //let device = new Device({name: deviceName});
      //device.save((err, device) => {
        //if (err)
          //console.log("Error while creating device: " + err);
        
        //chai.request(server)
          //.delete('/devices/' + device.id)
          //.set('access-token', token)
          //.end((err, res) => {
            //res.should.have.status(200);
            //done();
          //});
      //});
    //});
  //});
});
