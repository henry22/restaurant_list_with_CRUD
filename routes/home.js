// routes/home.js
const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
const {authenticated} = require('../config/auth')

router.get('/', authenticated, (req, res) => {
  let dropdownDisplay = '排序'
  let sortingPattern = {}
  switch (req.query.sort) {
    case 'asc':
      sortingPattern = { name: 'asc' }
      dropdownDisplay = 'A -> Z'
      break;
    case 'desc':
      sortingPattern = { name: 'desc' }
      dropdownDisplay = 'Z -> A'
      break;
    case 'category':
      sortingPattern = { category: 'asc' }
      dropdownDisplay = '類別'
      break;
    case 'location':
      sortingPattern = { location: 'asc' }
      dropdownDisplay = '地區'
      break;
  }
  Restaurant.find()
    .sort(sortingPattern)
    .lean()
    .exec((err, restaurants) => {
      if (err) return console.log(err)

      return res.render('index', { restaurants: restaurants, dropdownDisplay: dropdownDisplay})
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