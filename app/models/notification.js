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

var Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
