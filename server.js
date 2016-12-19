var express = require('express')
var app = express()
var phpServer = require('node-php-server')


phpServer.createServer({
    port: 8000,
    hostname: '127.0.0.1',
    base: '.',
    keepalive: false,
    open: false,
    bin: 'php',
    router: __dirname + '/server.php'
});



app.use('/', express.static(__dirname + '/'));

app.listen(3000, function(){
	console.log('Listening on port 3000')

});

