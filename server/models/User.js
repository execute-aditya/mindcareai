const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: false }, // Added name field
  mobile: { type: String, required: false }, // Added mobile field
});
module.exports = mongoose.model('User', userSchema);
