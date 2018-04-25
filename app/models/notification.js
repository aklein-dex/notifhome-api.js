var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var notificationSchema = new Schema({
  message: { type: String, required: true },
  user: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  device: [{ type: Schema.Types.ObjectId, ref: 'Device' }],
  created_at: Date,
  updated_at: Date
});

// on every save, add the date
notificationSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

var Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
