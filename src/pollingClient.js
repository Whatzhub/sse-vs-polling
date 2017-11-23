// Define Globals
var pollText = document.getElementById("pollingText");
var pollMsgs = document.getElementById("pollingMsgs");
var pollStats1 = document.getElementById("pollingStats1");
var pollStats2 = document.getElementById("pollingStats2");
var pollStats3 = document.getElementById("pollingStats3");
var pollStart = document.getElementById('pollingStart');
var pollClose = document.getElementById('pollingClose');
var pBar1 = document.getElementById("progressBar1");
var stopper = false;
var timeLapsed2 = 0;
var totalDelay2 = 0;
var requestCall1 = 1;
var pollMessages = [];

pollStart.addEventListener('click', function () {
    console.log('polling start');
    pollingAPI();
});

function pollingAPI() {
    stopper = false;
    
    var t10 = performance.now();
    axios.get('/polling')
        .then(function (res) {
            
            if (stopper) return console.log('Closed!');
    
            // console.log(res);

            // Polling Text
            var d = res.data;
            var t20 = performance.now();
            let t30 = +(t20 - t10).toFixed(2);
            var timeIncrement = +(2000 + t30).toFixed(2);
            timeLapsed2 += +(timeIncrement / 1000).toFixed(2);
            timeLapsed2 = +timeLapsed2.toFixed(2);
            var data = d.username + ' | id: ' + d.id + '<br> processing time: ' + d.timer + ' ms' + ' | time lapsed: ' + timeLapsed2 + ' secs';
            pollText.innerHTML = data;

            // Polling Msgs
            pollMessages.push(d.id);
            pollMsgs.innerHTML = "Msg ids received: " + pollMessages.join(', ');

            // Polling Stats
            var delay = +(timeIncrement - d.timer).toFixed(2);
            console.log(delay);
            if (d.timer >= 2000) delay = 0;
            totalDelay2 += +(delay / 1000).toFixed(2);
            totalDelay2 = +totalDelay2.toFixed(2);
            var data2 = 'Client Requests fired: ' + requestCall1 + ' times ';
            var data3 = 'Time delay to get messages: ' + delay + ' ms ';
            var data4 = 'Cumulative time delay: ' + totalDelay2 + ' secs ';
            pollStats1.innerHTML = data2;
            pollStats2.innerHTML = data3;
            pollStats3.innerHTML = data4;

            // Update progress bar
            if (pollMessages[pollMessages.length - 2] != d.id) pBar1.value++;
            requestCall1++;

            // Handling for final server message
            if (d.id == 'Done') {
                pollMessages.length = 0;
                timeLapsed2 = 0;
                totalDelay2 = 0;
                requestCall1 = 1;
                return console.log('Done!');
            }
            setTimeout(pollingAPI, 2000);
        })
        .catch(function (err) {
            console.log(err);
        });
}

pollClose.addEventListener('click', function() {
    console.log('polling close');
    stopper = true;
    pBar1.value = 0;
    pollText.innerHTML = '';
});