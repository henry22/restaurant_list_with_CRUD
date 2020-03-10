// config/passport.js
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
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

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({
      email: profile._json.email
    }).then(user => {
      if(!user) {
        let randomPassword = Math.random().toString(36).slice(-8)

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(randomPassword, salt, (err, hash) => {
            if(err) throw err

            let newUser = new User({
              name: profile._json.name,
              email: profile._json.email,
              password: hash
            })

            newUser.save().then(user => {
              return done(null, user)
            }).catch(err => console.error(err))
          })
        })
      } else {
        return done(null, user)
      }
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