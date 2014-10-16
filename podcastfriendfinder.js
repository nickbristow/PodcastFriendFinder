//This code is from https://github.com/dariusk/metaphor-a-minute
//will be modified, just placeholder for initial commit

var restclient = require('node-restclient');
var Twit = require('twit');
var app = require('express').createServer();

// I deployed to Nodejitsu, which requires an application to respond to HTTP requests
// If you're running locally you don't need this, or express at all.
app.get('/', function(req, res){
    res.send('Hello world.');
});
app.listen(3000);

// insert your twitter app info here
var T = new Twit({
  consumer_key:         '', 
  consumer_secret:      '',
  access_token:         '',
  access_token_secret:  ''
});





function favRTs () {
  T.get('statuses/retweets_of_me', {}, function (e,r) {
    for(var i=0;i<r.length;i++) {
      T.post('favorites/create/'+r[i].id_str,{},function(){});
    }
    console.log('harvested some RTs'); 
  });
}

// every 2 minutes, make and tweet a metaphor
// wrapped in a try/catch in case Twitter is unresponsive, don't really care about error
// handling. it just won't tweet.
setInterval(function() {
  try {
    T.get('search/tweets', { q: 'Game of Thrones', count: 2 }, function(err, data, response) {
        for(var i=0;i<data.statuses.length;i++)
        {
           T.post('favorites/create/:id',{id: data.statuses[i].id_str},function(){});
           console.log('favorites/create/'+data.statuses[i].id_str)
        }
        console.log(data)
    });


  }
 catch (e) {
    console.log(e);
  }
},20000);

// every 5 hours, check for people who have RTed a metaphor, and favorite that metaphor
setInterval(function() {
  try {
    favRTs();
  }
 catch (e) {
    console.log(e);
  }
},60000*60*5);