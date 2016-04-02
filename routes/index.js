module.exports = function(io) {
    var app = require('express');
    var router = app.Router();
    var tcpsock = require("net");

    var tcp_HOST = process.env.IP || '131.225.122.10';
    var tcp_PORT = (tcp_HOST == process.env.IP) ? 8081 : 1661;

    router.get('/', function(req, res, next) {
        res.render('index', { title: 'MCR Sound Server' });
    });

    tcpsock.createServer(function(tcpClient) {
        console.log('TCP CONNECTION: ' + tcpClient.remoteAddress +':'+ tcpClient.remotePort);

        io.on('connection', function(socket) {
            console.log('HTTP server listening on ' + tcp_HOST +':'+ tcp_PORT);
            socket.emit("httpServer", "Sound server started");

            socket.on('disconnect',function(){
                tcpClient.end();
                console.log('A user disconnected');
            });

            tcpClient.on('data', function(data) {
                console.log('DATA: ' + data);
                socket.emit("httpServer", alarmsTCP2Speech(data));
            });

            tcpClient.on('close', function(data) {
                socket.emit("httpServer", "Sound server connection removed");
                console.log('CLOSED: ' + tcpClient.remoteAddress +' '+ tcpClient.remotePort);
            });
        });

        tcpClient.on('connection', function() {
            console.log('A user connected');
        });

        tcpClient.on('end', function(data) {
            console.log('END : ' + data);
        });

        tcpClient.on('error', function(err) {
            console.log('ERROR : ' + err);
        });
    }).listen(tcp_PORT, tcp_HOST);

    return router;
};

function alarmsTCP2Speech(data) {
    var dataString = data.toString('ascii');
    switch (true) {
        case (/tmess/).test(dataString):
            return dataString.replace("tmess ","");
        case (/MCR_Firus/).test(dataString):
            return "phi russ";
        case (/MCR_Safety/).test(dataString):
            return "Safety System";
        case (/noise/).test(dataString):
            var noise = processNoise(dataString);
            return noise;
        case (/ackal/).test(dataString):
            return "Acknowledge";
        case (/A/).test(dataString):
            return "p bar Accumulator";
        case (/B/).test(dataString):
            return "Booster";
        case (/C/).test(dataString):
            return "Cryo";
        case (/D/).test(dataString):
            return "p bar debuncher";
        case (/I/).test(dataString):
            return "Main Injector";
        case (/L/).test(dataString):
            return "Linac";
        case (/R/).test(dataString):
            return "Recycler";
        case (/S/).test(dataString):
            return "Switchyard";
        case (/T/).test(dataString):
            return "Tevatron";
        case (/M/).test(dataString):
            return "Main Ring";
        case (/E/).test(dataString):
            return "E";
        case (/F/).test(dataString):
            return "Fixed Target";
        default:
            return "Unknown speech request";
    }
}

function processNoise(noise) {
    switch(true) {
        case (/0/).test(noise):
            return "Tick";
        case (/1/).test(noise):
            return "Airplane";
        case (/2/).test(noise):
            return "Bird";
        case (/3/).test(noise):
            return "Cat";
        case (/4/).test(noise):
            return "Duck";
        case (/5/).test(noise):
            return "Elephant";
        case (/6/).test(noise):
            return "Frog";
        case (/7/).test(noise):
            return "Goose";
        case (/8/).test(noise):
            return "Insect";
        case (/9/).test(noise):
            return "Jackhammer";
        case (/:/).test(noise):
            return "Loon";
        case (/;/).test(noise):
            return "Monkey";
        case (/</).test(noise):
            return "Rooster";
        case (/=/).test(noise):
            return "Ship";
        case (/>/).test(noise):
            return "Turkey";
        case (/\?/).test(noise):
            return "U-boat";
        case (/@/).test(noise):
            return "Tick";
        case (/A/).test(noise):
            return "Tick";
        case (/B/).test(noise):
            return "Tick";
        case (/C/).test(noise):
            return "Tick";
        case (/D/).test(noise):
            return "Tick";
    }
}
// Queue for annunciations