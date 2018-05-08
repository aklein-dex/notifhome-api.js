// https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Device = require('../app/models/device');
let Notification = require('../app/models/notification');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../notifhome');
let should = chai.should();

chai.use(chaiHttp);

describe('Notifications', () => {
  var token = ""
  
  before((done) => {
    
    // Create a device
    device = new Device({
      name: 'omega2'
    });
    device.save(function(err) {
      if (err)
        console.log("Error while registering device: " + err);
        
      token = device.token
      done();
    });
    
  });
  
  beforeEach((done) => { 
    //Before each test we empty the database
    Notification.remove({}, (err) => {
      done();
    });
  });
  
  describe('GET /device/notifications', () => {
    it('it should get all the new notifications for a device', (done) => {
      
      var pastDate = new Date('December 12, 2013 11:24:00');
      var presentDate = new Date();
      
      // Create 4 notifications in total, but 2 are in the past (older than device.last_request_at)
      Notification.collection.insert([{message: 'Should I buy milk?', created_at: pastDate}, 
                                      {message: 'I will be late', created_at: pastDate},
                                      {message: 'Are you sleeping?', created_at: presentDate}, 
                                      {message: 'Hello from Hawaii', created_at: presentDate}], (err) => {
        if (err)
          console.log("Error while creating notifications: " + err);
          
        chai.request(server)
          .get('/device/notifications')
          .set('access-token', token)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body['notifications'].should.be.a('array');
            res.body['notifications'].length.should.be.eql(2);
            done();
          });
      });
    });
    
    it('it should not return notifications if using invalid token for a device', (done) => {
      
      Notification.create([{message: 'Should I buy milk?'}, {message: 'I will be late'}], (err) => {
        if (err)
          console.log("Error while creating notifications: " + err);
          
        chai.request(server)
          .get('/device/notifications')
          .set('access-token', 'wrong')
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.not.have.property('notifications')
            done();
          });
      });
    });
  });
});
