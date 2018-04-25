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

app.get('/saved_restaurants.js', function(request, response) {
	response.sendFile(path.join(__dirname, '/', 'saved_restaurants/saved_restaurants.js'));
})

app.get('/saved_restaurants', function(request, response) {
	response.sendFile(path.join(__dirname, '/', 'saved_restaurants/saved_restaurants.html'));
})

app.get('/selector.js', function(request, response) {
	response.sendFile(path.join(__dirname, '/', 'find_restaurant/selector.js'));
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

app.get('/getMyRestaurants', function(request, response) {
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
        'SELECT Name, Stars, Price_Range, Address, Postal_Code, Crime_Rates, Restaurants.business_ID ' +
        'FROM Saved_rest JOIN Restaurants ' +
        'ON Saved_rest.business_id = Restaurants.business_ID ' +
        'WHERE username = \'' + username + '\'',
        function(err, result)
        {
          if (err) { console.error(err); return; }
        //  console.log(result.rows);
          response.json(result.rows);
        });
    });
});


app.get('/deleteMyRestaurants', function(request, response) {
  var business_id = request.query.id;
  console.log(business_id);
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
        'DELETE FROM SAVED_REST '+
        'WHERE USERNAME = \''+ username + '\' AND BUSINESS_ID = \''+ business_id +'\'',
        function(err, result)
        {
          if (err) { console.error(err); return; }
          connection.commit(function(error) {
            if (error) {console.error(error); return;}
          })
          response.json(business_id);
        });
    });
});

app.get('/getRestaurants', function(request, response) {
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
        'WITH T1 AS (SELECT Username, Business_id, Restaurants.Name, Restaurants.Stars, Restaurants.Price_Range, Address, Restaurants.Postal_Code, Restaurants.Crime_Rates '+
        'FROM Restaurants JOIN Preferences ON '+
        'preferences.Stars <= Restaurants.Stars '+
        'AND '+
        'Restaurants.crime_rates <= preferences.crime_rates '+
        'AND '+
        'Restaurants.price_range = preferences.Price_range '+
        'WHERE Username LIKE \'' + username + '\'), '+
        'T2 AS (SELECT Username, T1.Business_id, photo_id, T1.Name, T1.Stars, T1.Price_Range, Address, T1.Postal_Code, T1.Crime_Rates '+
        'FROM T1 JOIN PHOTOS ON '+
        'T1.business_id = photos.business_id), '+
        'T3 AS (SELECT Username, Name, Stars, Price_Range, Address, Postal_Code, Crime_Rates '+
        'FROM Restaurants JOIN Pref_cuisine ON '+
        'Restaurants.Categories LIKE (\'%\'||Pref_cuisine.cuisine||\'%\') '+
        'WHERE Username LIKE \'' + username + '\') '+
        'SELECT DISTINCT T2.Username, T2.photo_id, T2.business_id, T2.Name, T2.Stars, T2.Price_range, T2.Address, T2.Postal_code, T2.crime_Rates FROM T2 JOIN T3 ON T2.username = T3.username',
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


app.get('/checkMyRestaurant', function(request, response) {
  var business_id = request.query.id;
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
        'SELECT * FROM SAVED_REST ' +
        'WHERE USERNAME = \'' + username + '\' ' +
        'AND BUSINESS_ID = \'' + business_id + '\'',
        function(err, result)
        {
          if (err) { console.error(err); return; }
          response.json(result.rows);
        });
    });
});

app.get('/addMyRestaurant', function(request, response) {
  var business_id = request.query.id;
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
        'INSERT INTO SAVED_REST (USERNAME, BUSINESS_ID) '+
        'VALUES (\''+ username + '\', \''+ business_id +'\')',
        function(err, result)
        {
          if (err) { console.error(err); return; }
          connection.commit(function(error) {
            if (error) {console.error(error); return;}
          })
          response.json(business_id);
        });
    });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
