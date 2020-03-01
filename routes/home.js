// routes/home.js
const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .exec((err, restaurants) => {
      if (err) return console.log(err)

      return res.render('index', { restaurants: restaurants })
    })
})

// Search keyword
router.get('/search', (req, res) => {
  const keyword = req.query.keyword

  Restaurant.find({ name: { "$regex": keyword, "$options": "i" } })
    .lean()
    .exec((err, restaurants) => {
      if (err) return console.log(err)

      return res.render('index', { restaurants: restaurants, keyword: keyword })
    })
})

module.exports = router