const express = require('express')
const app = express()
const port = 3000
const expressHandlebars = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

// Use mongoose to connect to the mongodb server
mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useCreateIndex', true)

const db = mongoose.connection

db.on('error', () => console.log('mongodb error'))
db.once('open', () => console.log('mongodb connected'))

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

const Restaurant = require('./models/restaurant')
let number = 0

app.get('/', (req, res) => {
  Restaurant.find((err, restaurants) => {
    if (err) return console.log(err)

    number = restaurants.length

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
  number++
  // Create restaurant instance
  const restaurant = new Restaurant({
    number: number,
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

// Search keyword
app.get('/search', (req, res) => {
  const keyword = req.query.keyword

  Restaurant.find({ name: { "$regex": keyword, "$options": "i" } },
    (err, restaurants) => {
    if (err) return console.log(err)

    return res.render('index', { restaurants: restaurants, keyword: keyword })
  })
})

app.listen(port, () => console.log(`The server is listening on port:${port}`))