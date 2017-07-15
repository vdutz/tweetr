/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

function renderTweets(tweets) {
  tweets.forEach(function(item) {
    createTweetElement(item).prependTo($("#tweetlog"));
  })
}

function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function createTweetElement(tweetdata) {
  const { user, content, created_at, _id, likes } = tweetdata;
  // const { user: { avatars, name, handle }, content, created_at } = tweetdata;
  if (likes == "TRU") {
    redclass = " liked"
  } else {
    redclass = ""
  }

  milliseconds = (Date.now() - created_at)
  days = milliseconds / 1000 / 60 / 60 / 24
  roundedDays = Math.floor(days)
  hours = (days - roundedDays) * 24
  roundedHours = Math.floor(hours)
  minutes = (hours - roundedHours) * 60
  roundedMinutes = Math.floor(minutes)

  tweetString = `<article data-id="${_id}" class="tweetpost">
          <header>
            <img src="${escape(user.avatars.small)}">
            <h2 class="name">${escape(user.name)}</h2>
            <div class="handle">${escape(user.handle)}</div>
          </header>
          <div class="message">
            ${escape(content.text)}
          </div>
          <footer>
            <div class="timestamp">${roundedDays} days ${roundedHours} hrs ${roundedMinutes} mins ago</div>
            <div class="icons">
              <i class="fa fa-flag"></i>
              <i class="fa fa-retweet"></i>
              <i class="fa fa-heart${redclass}" data-likes="${likes}"></i>
            </div>
          </footer>
        </article>`
  $tweet = $(tweetString)
  return $tweet
}

$(document).ready(function() {

  // Function to load all the current tweets onto the webpage
  function loadTweets(){
    $.ajax({
      url: '/tweets/',
      method: 'GET',
      success: function(tweetsObject) {
        $("#tweetlog").empty()
        renderTweets(tweetsObject)
      }
    })
  }

  // Load all current tweets
  loadTweets()

  // When user submits a new tweet with the compose form:
  var $form = $('.new-tweet form');
  $form.on('submit', function (event) {
    event.preventDefault()
    $textarea = $form.children("textarea")
    $counter = $form.children(".counter")
    // Error checking user's tweet
    if ($textarea.val() === "" || $textarea.val() === null) {
      alert("You cannot post an empty tweet.")
      return;
    } else if ($counter.text() < 0) {
      alert("You cannot post a tweet that is over 140 characters.")
      return;
    }

    console.log('Button clicked, performing ajax call...');
    // Making a post request to create a new tweet in the database
    $.ajax({
      url: '/tweets/',
      method: 'POST',
      data: $(this).serialize(),
      success: function (response, status) {
        console.log('Success: ', status);
        loadTweets()

      }
    });
    $textarea.val("")
  });

  // When user submits registration info with the registration form
  var $registerForm = $('.registerbox form')
  $registerForm.on('submit', function (event) {
    event.preventDefault()
    //Making a post request to create a new user in the database
    $.ajax({
      url: '/tweets/register',
      method: 'POST',
      data: $(this).serialize(),
      success: function (response, status) {
        console.log('Registration status: ', status);
        $('.registerbox').slideToggle()
      }
    });
  })

  // When user submits login info with the login form
  var $loginForm = $('.loginbox form')
  $loginForm.on('submit', function (event) {
    event.preventDefault()
    // Making a put request to change the user's status to logged in
    $.ajax({
      url: '/tweets/login',
      method: 'PUT',
      data: $(this).serialize(),
      success: function (response, status) {
        console.log('Login status: ', status);
        $('.loginbox').slideToggle()
      }
    });
  })

  // When user clicks on the "Logout" button
  $('#nav-bar .logout').on('click', function (event) {
    // Making a put request to change the user's status to logged out
    $.ajax({
      url: '/tweets/logout',
      method: 'PUT',
      // data: $(this).serialize(),
      success: function (response, status) {
        console.log('Logout status: ', status);
      }
    });
  })

  $composeBox = $('.new-tweet')
  $registerBox = $('.registerbox')
  $loginBox = $('.loginbox')

  //The registration and login boxes are hidden on webpage startup
  $registerBox.hide()
  $loginBox.hide()

  // When user clicks the "Compose" button:
  $('#nav-bar').on('click', '.compose', function(event) {
    if ($composeBox.is(':hidden')) {
      $composeBox.slideToggle()
      $composeBox.find('textarea').focus()
    } else {
      $composeBox.slideToggle()
    }
    if (!$registerBox.is(':hidden')) {
      $registerBox.slideToggle()
    }
    if (!$loginBox.is(':hidden')) {
      $loginBox.slideToggle()
    }
  })

  // When user clicks the "Register" button:
  $('#nav-bar').on('click', '.register', function(event) {
    $registerBox.slideToggle()
    if (!$composeBox.is(':hidden')) {
      $composeBox.slideToggle()
    }
    if (!$loginBox.is(':hidden')) {
      $loginBox.slideToggle()
    }
  })

  // When user clicks the "Login" button:
  $('#nav-bar').on('click', '.login', function(event) {
    $loginBox.slideToggle()
    if (!$composeBox.is(':hidden')) {
      $composeBox.slideToggle()
    }
    if (!$registerBox.is(':hidden')) {
      $registerBox.slideToggle()
    }
  })

  // When a user clicks the like/heart button:
  $tweetlog = $('#tweetlog')
  $tweetlog.on('click', '.tweetpost .icons .fa-heart', function(event) {

    tweetid = $(this).closest('.tweetpost').data('id')

    if ($(this).data("likes") == "TRU") {
      $(this).data("likes", "FALS")
      $(this).removeClass('liked')
      // console.log("Test 2:", $(this).attr("class"));
      // Making a put request to change the tweet's status to not-liked
      $.ajax({
        url: `/tweets/${tweetid}/unlike/`,
        method: 'PUT',
        // data: {liked: true}
        success: function (response, status) {
          console.log('Like status: ', status);
          // loadTweets()
        }
      });

    } else if ($(this).data("likes") == "FALS") {
      $(this).data("likes", "TRU")
      $(this).addClass('liked')
      // console.log("Test 1:", $(this).attr("class"));
      // Making a put request to change the tweet's status to liked
      $.ajax({
        url: `/tweets/${tweetid}/like/`,
        method: 'PUT',
        // data: {liked: true}
        success: function (response, status) {
          console.log('Unlike status: ', status);
          // loadTweets()
        }
      })
    }

  })
})

