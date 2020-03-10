// routes/restaurant.js
const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
const {authenticated} = require('../config/auth')

// Read all restaurants
router.get('/', authenticated, (req, res) => {
  return res.redirect('/')
})

// Create one restaurant page
router.get('/new', authenticated, (req, res) => {
  return res.render('new')
})

// Restaurant detail page
router.get('/:restaurant_id', authenticated, (req, res) => {
  const restaurantId = req.params.restaurant_id

  Restaurant.findById(restaurantId)
    .lean()
    .exec((err, restaurant) => {
      if (err) return console.log(err)

      return res.render('show', { restaurant: restaurant })
    })
})

// Edit restaurant page
router.get('/:restaurant_id/edit', authenticated, (req, res) => {
  const restaurantId = req.params.restaurant_id

  Restaurant.findById(restaurantId)
    .lean()
    .exec((err, restaurant) => {
      if (err) return console.log(err)

      return res.render('edit', { restaurant: restaurant })
    })
})

// Create one restaurant
router.post('/', authenticated, (req, res) => {
  // Create restaurant instance
  const restaurant = new Restaurant({
    name: req.body.name,
    name_en: req.body.name_en,
    category: req.body.category,
    image: req.body.image,
    location: req.body.location,
    phone: req.body.phone,
    google_map: req.body.google_map,
    rating: Number(req.body.rating),
    description: req.body.description
  })

  restaurant.save(err => {
    if (err) return console.log(err)

    return res.redirect('/')
  })
})

// Update restaurant
router.put('/:restaurant_id', authenticated, (req, res) => {
  const restaurantId = req.params.restaurant_id

  Restaurant.findById(restaurantId, (err, restaurant) => {
    if (err) return console.log(err)

    restaurant.name = req.body.name
    restaurant.name_en = req.body.name_en
    restaurant.category = req.body.category
    restaurant.image = req.body.image
    restaurant.location = req.body.location
    restaurant.phone = req.body.phone
    restaurant.google_map = req.body.google_map
    restaurant.rating = Number(req.body.rating)
    restaurant.description = req.body.description

    restaurant.save(err => {
      if (err) return console.log(err)

      return res.redirect(`/restaurants/${restaurantId}`)
    })
  })
})

// Delete restaurant
router.delete('/:restaurant_id/delete', authenticated, (req, res) => {
  const restaurantId = req.params.restaurant_id

  Restaurant.findById(restaurantId, (err, restaurant) => {
    if (err) return console.log(err)

    restaurant.remove(err => {
      if (err) return console.log(err)

      return res.redirect('/')
    })
  })
})

module.exports = router