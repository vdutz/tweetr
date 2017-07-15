"use strict";

const mongo = require('mongodb')

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Generates a random user login token
    generateID: function generateRandomString() {
      var myArray = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "G", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
      var myString = "";
      for (var i = 0; i < 6; i++) {
        myString += myArray[Math.floor(Math.random() * myArray.length)];
      }
      console.log(myString)
      return myString;
    },

    // Saves a tweet to 'db'
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet)
      callback(null, true);
    },

    // Get all tweets in 'db', sorted by newest first
    getTweets: function(callback) {
      db.collection("tweets").find().toArray(callback);
      // db.close();
    },

    // Update the tweet that is liked
    updateLikes: function(id, newValue, callback) {
      // console.log("TEST ID: ", id)
      id = mongo.ObjectId(id)
      // let tweetToUpdate = db.collection("tweets").find(searchQuery)
      db.collection("tweets").update({"_id": id}, {$set: {"likes" : newValue}});
      callback(null, true);
    },

    // Saves a new user to 'db'
    saveUser: function(newUser, callback) {
      db.collection("users").insertOne(newUser)
      callback(null, true);
    },

    checkUser: function(email, password, callback) {

      db.collection("users").find().toArray(function(err, users) {
        let emailInUsers = false
        let passwordCorrect = false
        users.forEach(function(item) {
          if (email == item.email) {
            emailInUsers = true;
            if (password == item.password) {
              passwordCorrect = true;
            }
          }
          console.log("EMAIL IN USERS: ", emailInUsers)
        })
        callback({"emailInUsers": emailInUsers, "passwordCorrect": passwordCorrect})
      })
      // return {"emailInUsers": emailInUsers, "passwordCorrect": passwordCorrect}
      // callback(null, true)
    },

    loginUser: function(email, randomID, callback) {
      db.collection("users").update({"email": email}, {$set: {"loginToken" : randomID}});
      callback()
    },

    logoutUser: function(loginID, callback) {
      db.collection("users").update({"loginToken": loginID}, {$set: {"loginToken" : ""}});
      callback()
    }
  }
}
