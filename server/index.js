"use strict";

// Basic express setup
const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const path          = require('path')
const cookieSession        = require('cookie-session')
// const sassMiddleware= require('node-sass-middleware');
const app           = express();


app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

// app.use(
//      sassMiddleware({
//          src: path.join(__dirname, '../sass'), //where the sass files are
//          dest: path.join(__dirname, '../public/styles'), //where css should go
//          debug: true,
//          outputStyle: 'compressed',
//          error: function(err) {console.log(err)}
//      })
//  );

// console.log(path.join(__dirname, '../sass'))
// console.log(path.join(__dirname, '../public/styles'))
// console.log(__dirname)

app.use(express.static("public"));

// app.use(express.static("public"), express.static("public/styles"));


// Define the path to access the MongoDB database
const {MongoClient} = require("mongodb");
const MONGODB_URI = "mongodb://localhost:27017/tweeter";


// Connect to the MongoDb database and then
MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.log(`Failed to connect: ${MONGO_URI}`);
    throw err;
  }

  // We have a connection to the "test-tweets" db, starting here
  console.log(`Connected to mongodb: ${MONGODB_URI}`);

  // The `data-helpers` module provides an interface to the database of tweets.
  const DataHelpers = require("./lib/data-helpers.js")(db);

  // The `tweets-routes` module works similarly: we pass it the `DataHelpers` object so it can define routes that use it to interact with the data layer.
  const tweetsRoutes = require("./routes/tweets.js")(DataHelpers);

  // Mount the tweets routes at the "/tweets" path prefix
  app.use("/tweets", tweetsRoutes);

  app.listen(PORT, () => {
    console.log("Example app listening on port " + PORT);
  });
});
