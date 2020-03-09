// config/passport.js
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

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

        if (password !== user.password) {
          return done(null, false, {message: '密碼不正確'})
        }

        return done(null, user)
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