"use strict";

const userHelper    = require("../lib/util/user-helper");

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

    DataHelpers.getUserInfo(req.session.loginID, function(err, user) {
      const tweet = {
        user: user,
        content: {
          text: req.body.text
        },
        created_at: Date.now(),
        likes: []
      };

      DataHelpers.saveTweet(tweet, (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.status(201).send();
        }
      });
    })
  });

  tweetsRoutes.put("/:tweetid/like/", function(req, res) {

    if (!req.session.loginID) {
      res.status(401).send(); // Unauthorized - cannot like tweet if not logged in
    } else {
      let email = req.session.email;
      let tweetid = req.params.tweetid;

      DataHelpers.checkLikes(tweetid, email, (err, code) => {
        res.status(code).send();
      })
    }
  });

  tweetsRoutes.post("/register", function(req, res) {
    let randomID = DataHelpers.generateID();
    req.session.loginID = randomID;
    req.session.email = req.body.email;

    const avatar = req.body.avatar;

    const avatars = {
      small:   avatar,
      regular: avatar.replace("_50.png", ".png"),
      large:   avatar.replace("_50.png", "_200.png")
    };

    const user =  {
      name: req.body.name,
      handle: req.body.handle,
      avatars: avatars,
      email: req.body.email,
      password: req.body.password,
      loginToken: randomID
    };

    DataHelpers.saveUser(user, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send(req.body.email);
      }
    })
  })

  tweetsRoutes.put("/login", function(req, res) {
    // Check if email entered is in user database
    let email = req.body.email;
    let password = req.body.password;

    DataHelpers.checkUser(email, password, function(object, db) {
      if (!object.emailInUsers) {
        res.status(401).send();
      } else if (object.passwordCorrect === false) {
        res.status(403).send();
      } else {
        let randomID = DataHelpers.generateID();
        req.session.loginID = randomID;
        req.session.email = req.body.email;
        DataHelpers.loginUser(email, randomID, (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            res.status(201).send(email);
          }
        })
      }
    })
  })

  tweetsRoutes.put("/logout", function(req, res) {
    console.log(req.session.loginID);
    let loginID = req.session.loginID;
    DataHelpers.logoutUser(loginID, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        req.session = null;
        res.status(201).send();
      }
    })
  })

  return tweetsRoutes;

}
