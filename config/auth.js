// config/auth.js
module.exports = {
    authenticated: (req, res, next) => {
        if(req.isAuthenticated()) {
            next()
        } else {
            res.redirect('/users/login')
        }
    }
}