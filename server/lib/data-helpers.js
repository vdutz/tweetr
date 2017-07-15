"use strict";

const mongo = require('mongodb')

const userHelper = require("../lib/util/user-helper")

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
      return myString;
    },

    // Gets user's info from databse if logged in or creates random user info if not logged in
    getUserInfo: function(id, callback) {
      if (id) {
        db.collection("users").findOne({ "loginToken": id }, function (err, result) {
          let user = {
            name: result.name,
            handle: result.handle,
            avatars: result.avatars,
            email: result.email
          }
          callback(null, user)
        })
      } else {
        let user = userHelper.generateRandomUser()
        callback(null, user)
      }
    },

    // Saves a tweet to 'db'
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet)
      callback(null, true);
    },

    // Gets all tweets in 'db', sorted by newest first
    getTweets: function(callback) {
      db.collection("tweets").find().toArray(callback);
    },

    // Checks likes status of tweet.  Checks whether user is trying to like their own tweet and whether user has already liked that tweet
    checkLikes: function(id, email, callback) {
      id = mongo.ObjectId(id)
      db.collection("tweets").findOne({"_id": id}, function (err, result) {
        if (result.user.email === email) {
          let code = 403. // Forbidden - cannot like your own tweet
          callback(null, code)
        } else {
          let likesList = result.likes
          if (likesList.includes(email)) {
            let index = likesList.indexOf(email)
            likesList.splice(index, 1)
            db.collection("tweets").update({"_id": id}, {$set: {"likes" : likesList}});
            let code = 202 // Success - likes will decrease by 1
            callback(null, code)
          } else {
            likesList.push(email)
            db.collection("tweets").update({"_id": id}, {$set: {"likes" : likesList}});
            let code = 200 // Success - likes will increase by 1
            callback(null, code)
          }
        }
      })
    },

    // Updates the tweet that is liked
    updateLikes: function(id, newValue, callback) {
      id = mongo.ObjectId(id)
      db.collection("tweets").update({"_id": id}, {$set: {"likes" : newValue}});
      callback(null, true);
    },

    // Saves a new user to 'db'
    saveUser: function(newUser, callback) {
      db.collection("users").insertOne(newUser)
      callback(null, true);
    },

    // Checks whether user has entered a correct email and password
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
        })
        callback({"emailInUsers": emailInUsers, "passwordCorrect": passwordCorrect})
      })
    },

    // Logs the user in by adding a login-token to that user's database document
    loginUser: function(email, randomID, callback) {
      db.collection("users").update({"email": email}, {$set: {"loginToken" : randomID}});
      callback()
    },

    // Logs the user out by removing the login-token in that user's database document
    logoutUser: function(loginID, callback) {
      db.collection("users").update({"loginToken": loginID}, {$set: {"loginToken" : ""}});
      callback()
    }
  }
}
