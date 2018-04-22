var express = require('express')
var app = express()
var path=require('path')

app.set('port', (process.env.PORT || 8080))
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname, '/', 'index/index.html'));
})

app.get('/index.js', function(request, response) {
	response.sendFile(path.join(__dirname, '/', 'index/index.js'));
})

app.get('/signup', function(request, response) {
	response.sendFile(path.join(__dirname, '/', 'signup/signup.html'));
})

app.get('/signup.js', function(request, response) {
	response.sendFile(path.join(__dirname, '/', 'signup/signup.js'));
})

app.get('/main', function(request, response) {
	response.sendFile(path.join(__dirname, '/', 'main/main.html'));
})

app.get('/main.js', function(request, response) {
	response.sendFile(path.join(__dirname, '/', 'main/main.js'));
})

app.get('/preferences', function(request, response) {
	response.sendFile(path.join(__dirname, '/', 'preferences/preferences.html'));
})

app.get('/preferences.js', function(request, response) {
	response.sendFile(path.join(__dirname, '/', 'preferences/preferences.js'));
})

// app.get('/home', function(request, response) {
// 	response.sendFile(path.join(__dirname, '/', 'home/home.html'));
// })

// app.get('/home.js', function(request, response) {
// 	response.sendFile(path.join(__dirname, '/', 'home/home.js'));
// })

// app.get('/home.js', function(request, response) {
// 	response.sendFile(path.join(__dirname, '/', 'home/home.js'));
// })

// app.get('/signup', function(request, response) {
// 	response.sendFile(path.join(__dirname, '/', 'signup/signup.html'));
// })

// app.get('/restaurant', function(request, response) {
// 	response.sendFile(path.join(__dirname, '/', 'restaurant/restaurant.html'));
// })

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
