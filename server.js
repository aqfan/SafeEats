var express = require('express');
var app = express();
var path=require('path');
var parser = require("body-parser");

var AWS = require('aws-sdk');
AWS.config.region = process.env.REGION;

var oracledb = require('oracledb');

var username = 'angel';

app.set('port', (process.env.PORT || 8080));
app.use(express.static(path.join(__dirname, 'public')));
app.use(parser.json());

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
  console.log(username);
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

app.get('/logout', function(request, response) {
  console.log("logging out");
  username = "";
})

app.get('/setUsername', function(request, response) {
  username = request.query.username;
  console.log("username: "+request.query.username);
  response.json(username);
})

app.get('/getAllRest', function(request, response) {
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
        //  console.log(result.rows);
          response.json(result.rows);
        });
    });
});

app.get('/checkUsernameExists', function(request, response) {
  var username = request.query.username.toLowerCase();
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
        'SELECT * FROM LOGIN ' +
        'WHERE USERNAME = \'' + username + '\'',
        function(err, result)
        {
          if (err) { console.error(err); return; }
          connection.commit(function(error) {
            if (error) {console.error(error); return;}
          })
          response.json(result.rows);
        });
    });
});

app.get('/addNewUser', function(request, response) {
  var username = request.query.username;
  var password = request.query.password;
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
        'INSERT INTO LOGIN (USERNAME, PASSWORD) ' +
        'VALUES (\'' + username + '\', \'' + password + '\')',
        function(err, result)
        {
          if (err) { console.error(err); return; }
          connection.commit(function(error) {
            if (error) {console.error(error); return;}
          });
        });
      connection.execute(
        'INSERT INTO PREFERENCES (USERNAME) ' +
        'VALUES (\'' + username + '\')',
        function(err, result)
        {
          if (err) { console.error(err); return; }
          connection.commit(function(error) {
            if (error) {console.error(error); return;}
          });
        });
      response.json();

    });
});

app.get('/checkPostalCodeExists', function(request, response) {
  var username = parseInt(request.query.zipcode);
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
        'SELECT POSTAL_CODE FROM RESTAURANTS ' +
        'WHERE POSTAL_CODE = ' + username,
        function(err, result)
        {
          if (err) { console.error(err); return; }
          connection.commit(function(error) {
            if (error) {console.error(error); return;}
          })
          response.json(result.rows);
        });
    });
});

app.get('/saveRating', function(request, response) {
  var rating = parseInt(request.query.rating);
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
        'UPDATE PREFERENCES '+
        'SET STARS = '+ rating +
        'WHERE USERNAME = \''+ username +'\'',
        function(err, result)
        {
          if (err) { console.error(err); return; }
          connection.commit(function(error) {
            if (error) {console.error(error); return;}
          })
          response.json();
        });
    });
});


app.get('/savePriceRange', function(request, response) {
  var price_range = parseInt(request.query.price_range);
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
        'UPDATE PREFERENCES '+
        'SET PRICE_RANGE = '+ price_range +
        'WHERE USERNAME = \''+ username +'\'',
        function(err, result)
        {
          if (err) { console.error(err); return; }
          connection.commit(function(error) {
            if (error) {console.error(error); return;}
          })
          response.json();
        });
    });
});

app.get('/saveZipcode', function(request, response) {
  var zipcode = parseInt(request.query.zipcode);
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
        'UPDATE PREFERENCES '+
        'SET POSTAL_CODE = '+ zipcode +
        'WHERE USERNAME = \''+ username +'\'',
        function(err, result)
        {
          if (err) { console.error(err); return; }
          connection.commit(function(error) {
            if (error) {console.error(error); return;}
          })
          response.json();
        });
    });
});

app.get('/saveSafetyTolerance', function(request, response) {
  var safety_tolerance = parseInt(request.query.safety_tolerance);
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
        'UPDATE PREFERENCES '+
        'SET CRIME_RATES = '+ safety_tolerance +
        'WHERE USERNAME = \''+ username +'\'',
        function(err, result)
        {
          if (err) { console.error(err); return; }
          connection.commit(function(error) {
            if (error) {console.error(error); return;}
          })
          response.json();
        });
    });
});

app.get('/checkCuisinePrefs', function(request, response) {
  var cuisine = request.query.cuisine;
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
        'SELECT * FROM PREF_CUISINE ' +
        'WHERE USERNAME = \'' + username + '\' ' +
        'AND CUISINE = \'' + cuisine + '\'',
        function(err, result)
        {
          if (err) { console.error(err); return; }
          response.json(result.rows);
        });
    });
});

app.get('/saveCuisinePrefs', function(request, response) {
  var cuisine = request.query.cuisine;
  console.log(cuisine);
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
        'INSERT INTO PREF_CUISINE (USERNAME, CUISINE) '+
        'VALUES (\''+ username + '\', \''+ cuisine +'\')',
        function(err, result)
        {
          if (err) { console.error(err); return; }
          connection.commit(function(error) {
            if (error) {console.error(error); return;}
          })
          response.json();
        });
    });
});

app.get('/deleteCuisinePrefs', function(request, response) {
  var cuisine = request.query.cuisine;
  console.log(cuisine);
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
        'DELETE FROM PREF_CUISINE '+
        'WHERE USERNAME = \''+ username + '\' AND CUISINE = \''+ cuisine +'\'',
        function(err, result)
        {
          if (err) { console.error(err); return; }
          connection.commit(function(error) {
            if (error) {console.error(error); return;}
          })
          response.json();
        });
    });
});

app.get('/getUserPreferences', function(request, response) {
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
        'SELECT * FROM PREFERENCES ' +
        'WHERE USERNAME = \'' + username + '\'',
        function(err, result)
        {
          if (err) { console.error(err); return; }
          connection.commit(function(error) {
            if (error) {console.error(error); return;}
          })
          response.json(result.rows);
        });
    });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
