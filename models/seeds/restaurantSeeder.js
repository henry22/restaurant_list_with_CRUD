const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurantJson = require('./restaurant.json')
const restaurants = restaurantJson.results
const User = require('../user')
const bcrypt = require('bcryptjs')

mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const db = mongoose.connection

db.on('error', () => console.log('mongodb error'))

db.once('open', () => {
  console.log('mongodb connected')
  const users = []

  // Create user
  const user1 = new User({
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678'
  })

  const user2 = new User({
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678'
  })

  users.push(user1, user2);

  users.forEach(user => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if(err) throw err

        user.password = hash

        user.save(err => {
          if(err) throw err
        })
      })
    })
  })

  for (let i = 0; i < restaurants.length; i++) {
    if(restaurants[i].id <= 3) {
      Restaurant.create({
        name: restaurants[i].name,
        name_en: restaurants[i].name_en,
        category: restaurants[i].category,
        image: restaurants[i].image,
        location: restaurants[i].location,
        phone: restaurants[i].phone,
        google_map: restaurants[i].google_map,
        rating: restaurants[i].rating,
        description: restaurants[i].description,
        userId: user1._id
      })
    } else if (restaurants[i].id >= 4 && restaurants[i].id <= 6) {
      Restaurant.create({
        name: restaurants[i].name,
        name_en: restaurants[i].name_en,
        category: restaurants[i].category,
        image: restaurants[i].image,
        location: restaurants[i].location,
        phone: restaurants[i].phone,
        google_map: restaurants[i].google_map,
        rating: restaurants[i].rating,
        description: restaurants[i].description,
        userId: user2._id
      })
    }
  }

  console.log('done')
})