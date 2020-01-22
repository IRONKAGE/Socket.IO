var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 15000;

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

app.use(express.static(path.join(__dirname, '/')));

var numUsers = 0;

io.on('connection', (socket) => {
    var addedUser = false;
    console.log('Користувач приєднався');

    socket.on('new message', (data) => {
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
        console.log('Повідомлення надіслано');
    });

    socket.on('add user', (username) => {
        if (addedUser) return;
        socket.username = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers
        });
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
        console.log('Створено Нік');
    });

    socket.on('typing', () => {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
        console.log('Текст друкується');
    });

    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
        console.log('Текст не друкується');
    });

    socket.on('disconnect', () => {
        if (addedUser) {
            --numUsers;
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
        console.log('Користувач від\'єднався');
    });
});



// var app = require('express')();
// var server = require('http').createServer(app);
// var io = require('socket.io')();
// io.serveClient(false);
// io.attach(http);

// var io = require('socket.io')(server, {
//     path: '/test',
//     serveClient: false,
//     pingInterval: 10000,
//     pingTimeout: 5000,
//     cookie: false
// });

// io.attach(server, {
//     pingInterval: 10000,
//     pingTimeout: 5000,
//     cookie: false
// });

// io.sockets.emit('hi', 'everyone');

// io.origins((origin, callback) => {
//     if (origin !== 'https://foo.example.com') {
//         return callback('origin not allowed', false);
//     }
//     callback(null, true);
// });

// server.listen(3000, function(){
//     console.log('listening on *:3000');
// });

// app.get('/', function(req, res){
//     res.sendFile(__dirname + `/index.html`);
// });

// io.on('connection', function(socket){
//     socket.send('Hello world');

//     console.log('a user connected');
//     socket.on('disconnect', function(){
//         console.log('user disconnected');
//     });

//     socket.on('chat message', function(msg){
//         console.log('message: ' + msg);
//     });
// });

