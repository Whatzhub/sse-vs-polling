// Define Globals
var longPollText = document.getElementById("longPollText");
var longPollMsgs = document.getElementById("longPollMsgs");
var longPollStats = document.getElementById("longPollStats");
var longPollStart = document.getElementById('longPollStart');
var longPollClose = document.getElementById('longPollClose');
var pBar2 = document.getElementById("progressBar2");
var stopper = false;
var timeLapsed3 = 0;
var requestCall2 = 1;
var longPollMessages = [];

longPollStart.addEventListener('click', function () {
    console.log('long polling start');
    longPollingAPI();
});

function longPollingAPI() {
    stopper = false;
    var t10 = performance.now();
    axios.get('/longPoll')
        .then(function (res) {
            if (stopper) return console.log('Closed!');
            // console.log(res);

            // Polling Text
            var d = res.data;
            var t20 = performance.now();
            // let t30 = +(t20 - t10).toFixed(2);
            var timeIncrement = +(t20 - t10).toFixed(2);
            timeLapsed3 += +(timeIncrement / 1000).toFixed(2);
            timeLapsed3 = +timeLapsed3.toFixed(2);
            var data = d.username + ' | id: ' + d.id + '<br> processing time: ' + d.timer + ' ms' + ' | time lapsed: ' + timeLapsed3 + ' secs';
            longPollText.innerHTML = data;

            // Polling Msgs
            longPollMessages.push(d.id);
            longPollMsgs.innerHTML = "Msg ids received: " + longPollMessages.join(', ');

            // Polling Stats
            var data2 = 'Client Requests fired: ' + requestCall2 + ' times ';
            longPollStats.innerHTML = data2;

            // Update progress bar
            pBar2.value++;
            requestCall2++;

            // Handling for final server message
            if (d.id == 'Done') {
                longPollMessages.length = 0;
                timeLapsed3 = 0;
                requestCall2 = 1;
                return console.log('Done!');
            }
            longPollingAPI();
        })
        .catch(function (err) {
            console.log(err);
        });
}

longPollClose.addEventListener('click', function() {
    console.log('polling close');
    stopper = true;
    pBar2.value = 0;
    longPollText.innerHTML = '';
});