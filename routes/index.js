module.exports = function(io) {
    var app = require('express');
    var router = app.Router();
    var tcpsock = require("net");

    var tcp_HOST = process.env.IP || '131.225.122.10';
    var tcp_PORT = (tcp_HOST == process.env.IP) ? 8081 : 1661;

    router.get('/', function(req, res, next) {
        res.render('index', { title: 'MCR Sound Server' });
    });

    io.on('connection', function(socket) {
        // var tcpClient = new tcpsock.Socket();
        // var tcpClient.setEncoding("ascii");
        // var tcpClient.setKeepAlive(true);

        tcpsock.createServer(function(tcpClient) { //tcp_PORT, tcp_HOST, function() {
            // console.info('CONNECTED TO : ' + tcp_HOST + ':' + tcp_PORT);
            console.log('CONNECTED: ' + tcpClient.remoteAddress +':'+ tcpClient.remotePort);

            tcpClient.on('data', function(data) {
                console.log('DATA: ' + data);
                socket.emit("httpServer", alarmsTCP2Speech(data));
            });

            tcpClient.on('end', function(data) {
                console.log('END DATA : ' + data);
            });

            tcpClient.on('error', function(err) {
                console.log('ERROR : ' + err);
            });

            tcpClient.on('close', function(data) {
                console.log('CLOSED: ' + tcpClient.remoteAddress +' '+ tcpClient.remotePort);
            });
        }).listen(tcp_PORT, tcp_HOST);

        console.log('Server listening on ' + tcp_HOST +':'+ tcp_PORT);

        socket.on('tcp-manager', function(message) {
            console.log('"tcp" : ' + message);
            return;
        });

        socket.emit("httpServer", "Initial Data");

        console.log('a user connected');
        socket.on('disconnect',function(){
            // tcpClient.end();
            console.log('a user disconnected');
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
            return "phi russ";
        case (/MCR_Safety/).test(dataString):
            return "Safety System";
        case (/noise 0/).test(dataString):
            return "Tick";
        case (/noise :/).test(dataString):
            return "Loon";
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
            return "unknown speech request";
    }
}

// Queue for annunciations