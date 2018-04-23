var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var deviceSchema = new Schema({
  name: { type: String, required: true, unique: true },
  notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
  created_at: Date,
  updated_at: Date
});

var Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
