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

var Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
