var express = require('express');
var compression = require('compression');
var helpers = require('./helpers');
var app = express();
var server = require('http').Server(app);

// Express Api Paths
app.use(compression());
app.use(express.static(__dirname + '/src'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/index.html');
});

let i = 1;
let initFlag = false;
let totalTime = 0;
let timer = 0;

function polling() {

  initFlag = true;
  setTimeout(function () {

    timer = helpers.randomNumber(50, 3000);
    i++;
    totalTime += timer;
    console.log('polling msg sent', i, timer, totalTime);
    initFlag = false;
  }, timer);
}

app.get('/polling', (req, res) => {
  if (!initFlag) polling();

  if (i >= 20) {
    var success = {
      "username": "Server A",
      "id": "Done",
      "text": "Done",
      "timer": timer
    };
    i = 0;
    console.log('polling msg sent', "Done", timer, totalTime);
    // clearInterval(pollTimer);
    return res.json(success);
  }

  var json = {
    "username": "Server A",
    "id": i,
    "text": "This is message " + i,
    "timer": timer
  };
  return res.json(json);
});


// Long Polling

let j = 0;
let initFlag2 = false;
let totalTime2 = 0;
let timer2 = 0;

function longPoll() {

  return new Promise((resolve, reject) => {
    initFlag2 = true;

    setTimeout(function () {

      timer2 = helpers.randomNumber(50, 3000);
      j++;
      totalTime2 += timer2;
      console.log('long poll msg sent', j, timer2, totalTime2);
      initFlag2 = false;
      resolve();
    }, timer2);
  })

}

app.get('/longPoll', (req, res) => {
  if (!initFlag2) {
    longPoll()
      .then(_ => {
        if (j >= 20) {
          var success = {
            "username": "Server A",
            "id": "Done",
            "text": "Done",
            "timer": timer2
          };
          j = 0;
          console.log('polling msg sent', "Done", timer2, totalTime2);
          // clearInterval(pollTimer);
          return res.json(success);
        }

        var json = {
          "username": "Server A",
          "id": j,
          "text": "This is message " + j,
          "timer": timer2
        };
        return res.json(json);
      })
      .catch(err => console.log(err));
  }
});

// SSE API

let k = 0;
let totalTime3 = 0;
let timer3 = 0;

app.get('/sse', (req, res) => {

  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  });
  k = 0;
  function testSSE() {
    if (k == 'Done') {
      
      // clearInterval(timer);
      return res.status(404).end();
    }

    k++;
    timer3 = helpers.randomNumber(50, 3000);
    totalTime3 += timer3;
    if (k == 20) k = 'Done';

    res.write("event: " + 'TEST-EVENT' + "\n");
    res.write("id: " + k + "\n");
    // res.write("data: " + 'Hello SSE! ' + i + "\n\n");
    var json = {
      "username": "Server A",
      "id": k,
      "text": "This is message " + i,
      "timer": timer3
    };
    res.write("data: " + JSON.stringify(json) + "\n\n");
    console.log('server sse msg sent', k, timer3, totalTime3);
    res.flush();

    setTimeout(function () {
      testSSE();
    }, timer3);
  }
  testSSE();

});

server.listen(3000, () => {
  console.log('listening on *:3000');
  console.log(__dirname);
  console.log(process.env.PORT || 3000);
});