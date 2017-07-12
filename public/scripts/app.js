/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

var data = [
  {
    "user": {
      "name": "Newton",
      "avatars": {
        "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1499723872752
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": {
        "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  },
  {
    "user": {
      "name": "Johann von Goethe",
      "avatars": {
        "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      "handle": "@johann49"
    },
    "content": {
      "text": "Es ist nichts <script>alert('OOOOO')</script>schrecklicher als eine tätige Unwissenheit."
    },
    "created_at": 1451113796368
  }
];

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
  const { user, content, created_at } = tweetdata;
  // const { user: { avatars, name, handle }, content, created_at } = tweetdata;
  milliseconds = (Date.now() - created_at)
  days = milliseconds / 1000 / 60 / 60 / 24
  roundedDays = Math.floor(days)
  hours = (days - roundedDays) * 24
  roundedHours = Math.floor(hours)
  minutes = (hours - roundedHours) * 60
  roundedMinutes = Math.floor(minutes)

  tweetString = `<article class="tweetpost">
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
              <img src="/images/flag.png">
              <img src="/images/arrows.png">
              <img src="/images/heart.png">
            </div>
          </footer>
        </article>`
  $tweet = $(tweetString)
  return $tweet
}

$(document).ready(function() {

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

  loadTweets()

  var $form = $('.new-tweet form');
  $form.on('submit', function (event) {
    event.preventDefault()
    $textarea = $form.children("textarea")
    $counter = $form.children(".counter")
    if ($textarea.val() === "" || $textarea.val() === null) {
      alert("You cannot post an empty tweet.")
      return;
    } else if ($counter.text() < 0) {
      alert("You cannot post a tweet that is over 140 characters.")
      return;
    }

    console.log('Button clicked, performing ajax call...');
    console.log($(this).serialize())
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
  //renderTweets(data)
})

