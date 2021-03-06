module.exports = function(io) {
    var app = require('express');
    var router = app.Router();
    var tcpsock = require("net");

    var tcp_HOST = process.env.IP || '131.225.121.53';
    var tcp_PORT = (tcp_HOST == process.env.IP) ? 8081 : 1661;

    var queue = [];

    router.get('/', function(req, res, next) {
        res.render('index', { title: 'MCR Sound Server' });
    });

    // TCP connections from PA1661 currently on cns10
    var server = tcpsock.createServer(function(sock) {
        console.log('TCP CONNECTION: ' + sock.remoteAddress +':'+ sock.remotePort);
        io.emit("httpServer", "Sound server connected");

        sock.on('data', function(data) {
            console.log('ALARMS DATA: ' + data);
            queue.push(data);
            io.emit("httpServer", alarmsTCP2Speech(queue[0]));
        });

        sock.on('close', function(data) {
            io.emit("httpServer", "Sound server connection removed");
            console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
        });

        sock.on('end', function(data) {
            console.log('END DATA : ' + data);
            console.log('A user disconnected');
        });

        io.on('disconnect', function() {
            sock.end();
        });

        sock.on('error', function(err) {
            console.log('ERROR : ' + err);
        });
    }).listen(tcp_PORT, tcp_HOST);

    // TCP connections from PA4045 currently on cns4
    tcpsock.createServer(function(sock) {
        console.log('TCP CONNECTION: ' + sock.remoteAddress +':'+ sock.remotePort);
        io.emit("httpServer", "State server connected");

        sock.on('data', function(data) {
            console.log('STATE DATA: ' + data);
            queue.push(data);
            io.emit("httpServer", stateTCP2Speech(queue[0]));
        });

        sock.on('close', function(data) {
            io.emit("httpServer", "Sound server connection removed");
            console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
        });

        sock.on('end', function(data) {
            console.log('END DATA : ' + data);
            console.log('A user disconnected');
        });

        io.on('disconnect', function() {
            sock.end();
        });

        sock.on('error', function(err) {
            console.log('ERROR : ' + err);
        });
    }).listen('3721', '131.225.121.53');

    io.on('connection', function(socket) {
        console.log('HTTP server listening to ' + tcp_HOST +':'+ tcp_PORT);
        server.listen(tcp_PORT, tcp_HOST);
        socket.emit("httpServer", "Sound server started");

        socket.on('silent', function() {
            queue.shift();
            if(queue.length > 0) {
                socket.emit("httpServer", alarmsTCP2Speech(queue[0]));
            }
        });

        socket.on('playing', function() {
            if(queue.length > 0) {
                socket.emit("httpServer", alarmsTCP2Speech(queue[0]));
            }
        });

        socket.on('voiceTest', function(data) {
            console.log('VoiceTest: ' + data.text + ' ' + data.voice);
            queue.push(data);
            io.emit("httpServer", queue[0]);
        });
    });

    return router;
};

function alarmsTCP2Speech(data) {
    var dataString = data.toString('ascii');
    switch (true) {
        case (/tmess/).test(dataString):
            return dataString.replace("tmess ","");
        case (/MCR_Firus/).test(dataString):
            return "phyrus";
        case (/MCR_Safety/).test(dataString):
            return "Safety System";
        case (/noise/).test(dataString):
            var noise = processNoise(dataString);
            return noise;
        case (/ackal/).test(dataString):
            return "Acknowledge";
        case (/A/).test(dataString):
            return "P Bar Accumulator";
        case (/B/).test(dataString):
            return "Booster";
        case (/C/).test(dataString):
            return "Cryo";
        case (/D/).test(dataString):
            return "P Bar De buncher";
        case (/E/).test(dataString):
            return "E";
        case (/F/).test(dataString):
            return "Fixed Target";
        case (/I/).test(dataString):
            return "Main Injector";
        case (/L/).test(dataString):
            return "Linac";
        case (/M/).test(dataString):
            return "Main Ring";
        case (/R/).test(dataString):
            return "Recycler";
        case (/S/).test(dataString):
            return "Switchyard";
        case (/T/).test(dataString):
            return "Tevatron";
        default:
            return "Unknown speech request";
    }
}

function stateTCP2Speech(data) {
    var dataString = data.toString('ascii');
    switch (true) {
        case (/3/).test(dataString):
            return "P 2 Line Permit";
        case (/4/).test(dataString):
            return "P 1 Line Permit";
        case (/5/).test(dataString):
            return "B N B Permit";
        case (/6/).test(dataString):
            return "NuMI Permit";
        case (/7/).test(dataString):
            return "Recycler Permit";
        case (/8/).test(dataString):
            return "Switchyard Permit";
        case (/9/).test(dataString):
            return "Tevatron Permit";
        case (/10/).test(dataString):
            return "Main Injector Permit";
        case (/11/).test(dataString):
            return "P Bar Permit";
        case (/12/).test(dataString):
            return "Booster Permit";
        case (/13/).test(dataString):
            return "Linac Permit";
        case (/14/).test(dataString):
            return "Linac Downstream Permit";
        case (/15/).test(dataString):
            return "Linac Upstream Permit";
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