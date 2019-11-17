const express = require('express')
const app = express()
const port = 3000
const expressHandlebars = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

// Use mongoose to connect to the mongodb server
mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => console.log('mongodb error'))
db.once('open', () => console.log('mongodb connected'))

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

const Restaurant = require('./models/restaurant')

app.get('/', (req, res) => {
  Restaurant.find((err, restaurants) => {
    if (err) return console.log(err)

    return res.render('index', { restaurants: restaurants })
  })
})

// Read all restaurants
app.get('/restaurants', (req, res) => {
  return res.redirect('/')
})

// Create one restaurant page
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

// Read one restaurant
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurantId = req.params.restaurant_id

  Restaurant.findById(restaurantId, (err, restaurant) => {
    if (err) return console.log(err)

    return res.render('show', { restaurant: restaurant })
  })
})

// Create one restaurant
app.post('/restaurants', (req, res) => {

})


app.get('/search', (req, res) => {
  const keyword = req.query.keyword

  Restaurant.find((err, restaurants) => {
    if (err) return console.log(err)

    const filteredRestaurants = restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(keyword.toLowerCase()))

    return res.render('index', { restaurants: filteredRestaurants, keyword: keyword })
  })
})

app.listen(port, () => console.log(`The server is listening on port:${port}`))