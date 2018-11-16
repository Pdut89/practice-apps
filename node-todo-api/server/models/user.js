const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '${VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    }
  }]
})

UserSchema.methods.toJSON = function() {
  const user = this
  const userObject = user.toObject()
  const {_id, email} = userObject

  return {_id, email}
}

UserSchema.methods.generateAuthToken = function() {
  const user = this
  const access = 'auth'
  const token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString()

  user.tokens = user.tokens.concat([{access, token}])

  return user.save()
    .then(() => token)
}

// Statics makes it a model method, otherwide it's an instance method
UserSchema.statics.findByToken = function(token) {
  const User = this
  let decoded = undefined

  try {
    decoded = jwt.verify(token, 'abc123')
  } catch (err) {
    return Promise.reject(err)
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

UserSchema.statics.findByCredentials = function(email, password) {
  const User = this
  return User.findOne({email})
    .then(user => {
      if (!user) Promise.reject('User could not be found')

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
          if(res) resolve(user)
          reject('Password does not match.')
        })
      })
    })
}

UserSchema.pre('save', function(next) {
  var user = this

  if(user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
       user.password = hash
       next()
      })
    })
  } else {
    next()
  }
})

const User = mongoose.model('User', UserSchema);

module.exports = {User}
