'use strict';

const fs = require('fs');
const path = require('path');
const Twit = require('twit');

const T = new Twit({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET
});

function getRandomLine() {
  const datadir = path.join(__dirname, 'data');

  const files = fs.readdirSync(datadir).filter(f => f.endsWith('.txt'));

  const file = files[Math.floor(Math.random() * files.length)];

  const lines = fs.readFileSync(path.join(datadir, file), 'utf8')
    .split('\n').filter(n => n);

  return lines[Math.floor(Math.random() * lines.length)];
}

module.exports.test = (event, context, callback) => {
  const line = getRandomLine();

  const response = {
    statusCode: 200,
    body: line,
  };

  callback(null, response);
};

module.exports.tweet = (event, context, callback) => {
  const line = getRandomLine();

  if (line) {
    T.post('statuses/update', { status: line }, (err, data, response) => {
      if (err) {
        console.error(err);
        callback(err);
      } else {
        console.log(data);
        callback(null, {
          message: `Tweeted: ${line}`
        });
      }
    });
  } else {
    console.error('Cannot get lyric');
    callback('Cannot get lyric');
  }
};
