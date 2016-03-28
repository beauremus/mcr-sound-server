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
    var dataString = data.toString('utf8');
    switch (dataString) {
        case "MCR_Firus":
            return "fi rus";
        case "MCR_Safety":
            return "Safety System";
        case "speak A":
            return "p bar Accumulator";
        case "speak B":
            return "Booster";
        case "speak C":
            return "Cryo";
        case "speak D":
            return "p bar debuncher";
        case "speak I":
            return "Main Injector";
        case "speak L":
            return "Linac";
        case "speak R":
            return "Recycler";
        case "speak S":
            return "Switchyard";
        case "speak T":
            return "Tevatron";
        case "speak M":
            return "Main Ring";
        case "speak E":
            return "E";
        case "speak F":
            return "Fixed Target";
        default:
            return "unknown speech request";
    }
}

// Queue for annunciations