const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurantJson = require('./restaurant.json')
const restaurants = restaurantJson.results

mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => console.log('mongodb error'))

db.once('open', () => {
  console.log('mongodb connected')

  for (let i = 0; i < restaurants.length; i++) {
    Restaurant.create({
      _id: restaurants[i].id,
      name: restaurants[i].name,
      name_en: restaurants[i].name_en,
      category: restaurants[i].category,
      image: restaurants[i].image,
      location: restaurants[i].location,
      phone: restaurants[i].phone,
      google_map: restaurants[i].google_map,
      rating: restaurants[i].rating,
      description: restaurants[i].description
    })
  }

  console.log('done')
})