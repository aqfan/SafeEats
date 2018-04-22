var express = require('express')
var app = express()
var path=require('path')

app.set('port', (process.env.PORT || 8080))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname, '/', 'routes/index.html'));
})

app.get('/signup', function(request, response) {
	response.sendFile(path.join(__dirname, '/', 'routes/signup.html'));
})

app.get('/home', function(request, response) {
	response.sendFile(path.join(__dirname, '/', 'home/home.html'));
})

app.get('/restaurant', function(request, response) {
	response.sendFile(path.join(__dirname, '/', 'routes/restaurant.html'));
})

app.get('/script.js', function(request, response) {
	response.sendFile(path.join(__dirname, '/', 'home/home.js'));
})

app.get('/style.css', function(request, response) {
	response.sendFile(path.join(__dirname, '/', 'style.css'));
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
