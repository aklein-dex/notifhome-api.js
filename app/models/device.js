var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const tokenMiddleware = require('../middlewares/token');

// create a schema
var deviceSchema = new Schema({
  name:            { type: String, required: true, unique: true },
  token:           { type: String },
  notifications:   [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
  last_request_at: Date,
  created_at:      Date,
  updated_at:      Date
});

// on every save, add the date
deviceSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  if (this.isNew) {
    // Generate token
    this.token = tokenMiddleware.generateTokenForDevice(this);
    this.last_request_at = currentDate;
  }
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

var Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
