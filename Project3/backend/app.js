const express = require("express");
const axios = require("axios");
const geohash = require("ngeohash");
const path = require("path");

const app = express();

var SpotifyWebApi = require('spotify-web-api-node');

var clientId = '06ca53780b3349f09cb6f32a51d204df',
  clientSecret = '313461b51bc44022b4580d2561fa83b4';

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});


    // Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);



const autocompleteApi = "https://app.ticketmaster.com/discovery/v2/suggest?";
const eventSearchApi = "https://app.ticketmaster.com/discovery/v2/events.json?";
const eventDetailsApi = "https://app.ticketmaster.com/discovery/v2/events/";
const venueDetailsApi = "https://app.ticketmaster.com/discovery/v2/venues?apikey=";


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.get("/autocomplete", async function (req, res, next) {
  const query = req.query;
  const apikey = query.apikey;
  const keyword = query.keyword;


  const params = {
    params: {
      apikey: apikey,
      keyword: keyword
    }
  }

  const response = await axios.get(autocompleteApi, params);
  // console.log(response);
  res.json(response.data);
})


app.get("/eventSearch", async function (req, res, next) {
  const query = req.query;
  const apikey = query.apikey;
  const keyword = query.keyword;
  const segmentId = query.segmentId;
  const radius = query.radius;
  const unit = query.unit;
  const lat = query.lat;
  const lng = query.lng;

  const geoPoint = geohash.encode(lat, lng);

  console.log(geoPoint);

  const params = {
    params: {
      apikey: apikey,
      keyword: keyword,
      segmentId: segmentId,
      radius: radius,
      unit: unit,
      geoPoint: geoPoint
    }
  }

  const response = await axios.get(eventSearchApi, params);
  res.json(response.data);
})

app.get("/eventDetails", async function(req, res, next) {
      // Retrieve an access token.
  spotifyApi.clientCredentialsGrant().then(
    function(data) {
      console.log('The access token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
    },
    function(err) {
      console.log('Something went wrong when retrieving an access token', err);
    }
  );
  let urlString = eventDetailsApi;
  const query = req.query;

  urlString += query.id;
  urlString += "?apikey=";
  urlString += query.apikey;

  const response = await axios.get(urlString);
  res.json(response.data);
})

app.get("/venueDetails", async function(req, res, next) {
  let urlString = venueDetailsApi;
  const query = req.query;

  urlString += query.apikey;
  urlString += "&keyword=";
  urlString += query.keyword;

  const response = await axios.get(urlString);
  res.json(response.data);
})

app.get("/searchArtists", async function(req, res, next) {
  const query = req.query;
  const name = query.name;

  // console.log(name);
  spotifyApi.searchArtists(name)
    .then(function(data) {
      // console.log('artist: ', data.body);
      res.json(data.body);
    }, function(err) {
      console.log("wrong: ", err);
    })
})

app.get("/getArtistAlbums", async function(req, res, next) {
  const query = req.query;
  const id = query.id;

  console.log(id);

  spotifyApi.getArtistAlbums(id, { limit: 3 })
  .then(function(data) {
    console.log('Artist albums', data.body);
    res.json(data.body);
  }, function(err) {
    console.error(err);
  });
})

module.exports = app;
