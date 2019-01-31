var express = require('express');
var router = express.Router();
var request = require('request');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('oauth2.properties');

// grab properties from the oauth2.properties file.
var client_id = properties.get('main.client_id');
var client_secret = properties.get('main.client_secret');
var token_host = properties.get('main.token_host');
var token_path = properties.get('main.token_path');
var authorize_path = properties.get('main.authorize_path');
var callback_url = properties.get('main.callback_url');
var user_api_url = properties.get('main.user_api_url');

// Set the configuration settings
const credentials = {
  client: {
    id: client_id,
    secret: client_secret
  },
  auth: {
    tokenHost: token_host,
    tokenPath: token_path,
    authorizePath: authorize_path
  }
};

// Initialize the OAuth2 Library
const oauth2 = require('simple-oauth2').create(credentials);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'OAuth2 Backend Server' });
});

/* Backend which receives code, and turns it into an access token */
router.post('/backend', async (req, res) => {
  const code = req.body.code;
  const options = {
    code,
    redirect_uri: callback_url
  };

  console.log("received code is " + code);

  try {
    const result = await oauth2.authorizationCode.getToken(options);
    console.log('The resulting token: ', result);
    const token = oauth2.accessToken.create(result);
    getUser(result);
  } catch(error) {
    console.error('Access Token Error', error.message);
    return res.status(500).json('Authentication failed');
  }

  // uses the access token to call the user api to figure out who is logged in
  // idea being that the access token is never exposed to the client app, everything done on the server
  function getUser(result) {
    request({
      url: user_api_url,
      auth: {
        'bearer': result.access_token
      }
    }, function(err, response) {
      if (err) {
        res.status(500).json("Something has gone horribly wrong");
      }
      var getresponse = JSON.parse(response.body);
      var user = getresponse.user;
      if (user) {
        console.log("Backend API response for User is " + user);
        res.status(200).json(usre);
      } else {
        res.status(500).json("Something has gone horribly wrong");
      }

    });
  }
});

module.exports = router;
