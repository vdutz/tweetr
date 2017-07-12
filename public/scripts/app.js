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
    "created_at": 1461116232227
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
      "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    },
    "created_at": 1461113796368
  }
];

function renderTweets(tweets) {
  tweets.forEach(function(item) {
    createTweetElement(item).appendTo($("#tweetlog"));
  })
}

function createTweetElement(tweetdata) {
  const { user, content, created_at } = tweetdata;
  // const { user: { avatars, name, handle }, content, created_at } = tweetdata;
  tweetString = `<article class="tweetpost">
          <header>
            <img src="${user.avatars.small}">
            <h2 class="name">${user.name}</h2>
            <div class="handle">${user.handle}</div>
          </header>
          <div class="message">
            ${content.text}
          </div>
          <footer>
            <div class="timestamp">${created_at}</div>
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
  renderTweets(data)
})

