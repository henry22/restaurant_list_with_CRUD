const express = require('express')
const app = express()
const port = 3000
const expressHandlebars = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

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

app.use(methodOverride('_method'))

const Restaurant = require('./models/restaurant')

app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .exec((err, restaurants) => {
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

// Restaurant detail page
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurantId = req.params.restaurant_id

  Restaurant.findById(restaurantId)
    .lean()
    .exec((err, restaurant) => {
      if (err) return console.log(err)

      return res.render('show', { restaurant: restaurant })
    })
})

// Search keyword
app.get('/search', (req, res) => {
  const keyword = req.query.keyword

  Restaurant.find({ name: { "$regex": keyword, "$options": "i" } })
    .lean()
    .exec((err, restaurants) => {
      if (err) return console.log(err)

      return res.render('index', { restaurants: restaurants, keyword: keyword })
    })
})

// Edit restaurant page
app.get('/restaurants/:restaurant_id/edit', (req, res) => {
  const restaurantId = req.params.restaurant_id

  Restaurant.findById(restaurantId)
    .lean()
    .exec((err, restaurant) => {
      if (err) return console.log(err)

      return res.render('edit', { restaurant: restaurant })
    })
})

// Create one restaurant
app.post('/restaurants', (req, res) => {
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
app.put('/restaurants/:restaurant_id', (req, res) => {
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
app.delete('/restaurants/:restaurant_id/delete', (req, res) => {
  const restaurantId = req.params.restaurant_id

  Restaurant.findById(restaurantId, (err, restaurant) => {
    if (err) return console.log(err)

    restaurant.remove(err => {
      if (err) return console.log(err)

      return res.redirect('/')
    })
  })
})

app.listen(port, () => console.log(`The server is listening on port:${port}`))