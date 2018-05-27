var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
var SerialPort = require('serialport');
var serialport = new SerialPort('/COM3', {
    parser: SerialPort.parsers.readline('\n')
});

app.engine('ejs', require('ejs').__express);
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res){
    res.render('index');
});

io.on('connection', function(socket){
    console.log('socket.io connection');

    serialport.on('data', function(data){
        data = data.replace(/(\r\n|\n|\r)/gm,"");
        var dataArray = data.split(',');
        console.log(dataArray);
        socket.emit("data", dataArray);
    });
    
    socket.on('disconnect', function(){
        console.log('disconnected');
    });
});

server.listen(3000, function(){
    console.log('listening on port 3000...');
});
