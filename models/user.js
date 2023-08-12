const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email : {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный EMAIL',
    },
  },
  password : {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('user', userSchema);
module.exports = User;
