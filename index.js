'use strict'
// Dependencies
const path = require('path');
const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 80

// Set paths
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.resolve(__dirname, 'views'))
app.set('view engine', 'ejs')

// Load message history from json
var messages = []

require('fs').readFile('arraylog.json', 'utf8', function(err, data){
    if (err){
        console.log(err);
    } else {
    var arraylog = JSON.parse(data); //json -> object
	for (var message in (arraylog)){
          messages.push(arraylog[message])
        }
    }
})
app.locals.messages = messages //persistant

// Middleware
app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: false}))

// Routes
app.get('/', (req, res) => {
  res.render('index')
})

app.get('/add', (req, res) => {
  res.render('add')
})

app.post('/add', (req, res) => {
  if (!req.body.name || !req.body.message) {
    res.status(400).send('Enter a message and your name :)')
  }
  // Add new message to persistant and json history
  messages.unshift({
    "name": req.body.name,
    "message": req.body.message,
    "saved": new Date().toISOString().substring(0,16),
  })
  require('fs').writeFile(
    './arraylog.json',
    JSON.stringify(messages), //object -> json
    function (err) {
        if (err) {
            console.error('File Write Error');
        }
    }
  );
  res.redirect('/')
})

// Error 404
app.use( (req, res) => {
  res.status(404).render('404')
})

// Start server
app.listen(port,() => {
  console.log(`Listening on http://localhost:${port}`);
})
