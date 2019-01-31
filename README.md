# OAuth 2.0 Server

This is an example OAuth 2.0 server which receives an authorization code from a client app, obtains an OAuth 2.0 access token using a client_id and client_secret, and then can call an API endpoint to obtain a username. 

Idea behind this was to keep the Access Token off the client and on the backend server, as the token is used for a 3rd party API.  

## OAuth 2.0 Client App
This app works hand in hand with the [OAuth 2.0 Client App](https://github.com/beauchompers/nodejs-oauth-client)

## Setup Instructions

Make sure you have Node JS installed, and then run npm install to bring down the required packages.

## Running the App

You can run the app using nodemon, or use the command:

```
node ./bin/wwww
```


