var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var deviceSchema = new Schema({
  name: { type: String, required: true, unique: true },
  token: { type: String },
  notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
  created_at: Date,
  updated_at: Date
});

// on every save, add the date
deviceSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

var Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
