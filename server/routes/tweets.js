"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now(),
      likes: "FALS"
    };

    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  });

  tweetsRoutes.put("/:tweetid/like/", function(req, res) {
    DataHelpers.updateLikes(req.params.tweetid, "TRU", (err) =>{
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    })
  });

  tweetsRoutes.put("/:tweetid/unlike/", function(req, res) {
    DataHelpers.updateLikes(req.params.tweetid, "FALS", (err) =>{
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    })
  });

  tweetsRoutes.post("/register", function(req, res) {
    let randomID = DataHelpers.generateID()
    req.session.loginID = randomID
    const user =  {
      email: req.body.email,
      password: req.body.password,
      loginToken: randomID
    }

    DataHelpers.saveUser(user, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    })
  })

  tweetsRoutes.post("/login", function(req, res) {
    // Check if email entered is in user database
    console.log("TEST EMAIL: ", req.body.email)
    let email = req.body.email
    let password = req.body.password

    DataHelpers.checkUser(email, password, function(object, db) {
      if (!object.emailInUsers) {
        console.log("Email not in records")
        res.status(403).send("Your email address does not match our records")
      } else if (object.passwordCorrect === false) {
        console.log("Password doesn't match")
        res.status(403).send("Your password does not match your email address.")
      } else {
        console.log("Everything matched!")
        let randomID = DataHelpers.generateID() // check this later
        req.session.loginID = randomID
        // db.collection("users").update
        // item.loginToken = randomID
        res.status(201).send();
      }
    })
    // console.log("EMAIL in USERS: ", object.emailInUsers)

    // if (!object.emailInUsers) {
    //   console.log("Email not in records")
    //   res.status(403).send("Your email address does not match our records")
    // } else if (object.passwordCorrect === false) {
    //   console.log("Password doesn't match")
    //   res.status(403).send("Your password does not match your email address.")
    // } else {
    //   let randomID = DataHelpers.generateID() // check this later
    //   req.session.loginID = randomID
    //   // db.collection("users").update
    //   item.loginToken = randomID
    //   res.status(201).send();
    // }

      // (err) => {
      // if (err) {
      //   res.status(500).json({ error: err.message });
      // } else {
      //   res.status(201).send();
      // }
    // })

  })

  tweetsRoutes.put("/logout", function(req, res) {
    // console.log(req.session.loginID)

    // DataHelpers.logoutUser()

    req.session = null
    res.status(201).send();
  })

  return tweetsRoutes;

}
