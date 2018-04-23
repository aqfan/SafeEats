var express = require('express')
var app = express()
var path=require('path')
var AWS = require('aws-sdk');
AWS.config.region = process.env.REGION

var oracledb = require('oracledb');
oracledb.getConnection(
  {
    user          : "SafeEats",
    password      : "cis450project",
    connectString : "(DESCRIPTION = (ADDRESS = (PROTOCOL = TCP)(HOST = Cis450project.c42vw5k2slsd.us-east-1.rds.amazonaws.com)(PORT = 1521))(CONNECT_DATA = (SERVER = DEDICATED) (SERVICE_NAME = ORCL)))"
  },
  function(err, connection)
  {
    if (err) { console.error('oracle-error:'+err); return; }
    connection.execute(
      'SELECT NAME, STARS FROM RESTAURANTS',
      function(err, result)
      {
        if (err) { console.error(err); return; }
        console.log(result.rows);
      });
  });

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

app.get('/home', function(request, response) {
	response.sendFile(path.join(__dirname, '/', 'home/home.html'));
})

app.get('/home.js', function(request, response) {
	response.sendFile(path.join(__dirname, '/', 'home/home.js'));
})

app.get('/signup', function(request, response) {
	response.sendFile(path.join(__dirname, '/', 'signup/signup.html'));
})

app.get('/find_restaurant', function(request, response) {
	response.sendFile(path.join(__dirname, '/', 'find_restaurant/find_restaurant.html'));
})

app.get('/saved_restaurants', function(request, response) {
	response.sendFile(path.join(__dirname, '/', 'saved_restaurants/saved_restaurants.html'));
})

app.get('/selector', function(request, response) {
	response.sendFile(path.join(__dirname, '/', 'selector/selector.html'));
})

app.get('/selector.js', function(request, response) {
	response.sendFile(path.join(__dirname, '/', 'selector/selector.js'));
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
