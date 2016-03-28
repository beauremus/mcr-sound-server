Mr House
=======
Mr House is a TCP/HTTP server that handles the data streams from the Fermilab
MCR console designated in the code. The TCP server simply filters and passes
the requests to the HTTP client. The client then uses the javascript [Web Speech
API][1] and [ResponsiveVoice][2] to speek messages passed from the server. The client is
set to use designated MP3s on certain data.

NodeJS is used for the TCP/HTTP servers. The node modules required to run this
project as-is include [express][3], [jade][4], [net][5], [serve-favicon][6],
[socket.io][7], [socket.io-client][8].

### Relevant References
* [Web_Speech_API][1]
* [ResponsiveVoice.js][2]
* [c9.io][9]

This project was developed in the Cloud9 IDE and versioned with git and bitbucket.

Getting Started
------
This program will not run without an outside TCP client serving the subset of
data designated in the index.js. The server must be run within the Control's
Firewall so that PA1661 can communicate with the server.

This project lovingly developed by Beau Harrison <beau@fnal.gov>

[1]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
[2]: http://responsivevoice.org
[3]: https://www.npmjs.com/package/express
[4]: https://www.npmjs.com/package/jade
[5]: https://nodejs.org/api/net.html
[6]: https://www.npmjs.com/package/serve-favicon
[7]: https://www.npmjs.com/package/socket.io
[8]: https://www.npmjs.com/package/socket.io-client
[9]: http://c9.io