// Define Globals
var es;
var startAll = document.getElementById('startAll');
var sseText = document.getElementById("sseText");
var sseStats = document.getElementById("sseStats");
var sseStart = document.getElementById('sseStart');
var sseClose = document.getElementById('sseClose');
var pBar3 = document.getElementById("progressBar3");
var timeLapsed = 0;
var sseMessages = [];

function SSEStart() {
    es = new EventSource('/sse');
    var t1 = performance.now();
    sseMessages.length = 0;
    es.addEventListener('TEST-EVENT', function (e) {
        console.log(4, e);
        var d = JSON.parse(e.data);
        var t2 = performance.now();
        timeLapsed = t2 - t1;
        var data = d.username + ' | id: ' + e.lastEventId + '<br> processing time: ' + d.timer + ' ms' + ' | time lapsed: ' + (timeLapsed / 1000).toFixed(2) + ' secs ';
        sseText.innerHTML = data;
        pBar3.value++;

        // SSE Msgs
        sseMessages.push(e.lastEventId);
        sseMsgs.innerHTML = "Msg ids received: " + sseMessages.join(', ');

        // SSE Stats
        var data3 = 'Client Requests fired: ' + 1 + ' times ';
        sseStats.innerHTML = data3;

        if (e.lastEventId == 'Done') {
            // Close connection.
            es.close();
            return console.log(e, 'connection closed')
        }
    });

    es.addEventListener('open', function (e) {
        // Connection was opened.
        return console.log(e, 'connection opens');
    });

    es.addEventListener('error', function (e) {
        console.log(e, 'connection error & closed');
    });
}
// Add Listeners
sseStart.addEventListener('click', function () {
    console.log('start');
    SSEStart();
});

sseClose.addEventListener('click', function () {
    console.log('close!');
    sseText.innerHTML = '';
    pBar3.value = 0;
    es.close();
});

// INIT ALL TEST
startAll.addEventListener('click', function () {
    console.log('start all');
    pBar1.value = 0;
    pBar2.value = 0;
    pBar3.value = 0;
    SSEStart();
    pollingAPI();
    longPollingAPI();
});