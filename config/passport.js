// config/passport.js
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = passport => {
  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, (email, password, done) => {
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, {message: 'email已經被註冊過'})
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if(err) throw err

          if(isMatch) {
            return done(null, user)
          } else {
            return done(null, false, { message: '密碼不正確' })
          }
        })
      })
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .exec((err, user) => {
        done(err, user)
      })
  })
}