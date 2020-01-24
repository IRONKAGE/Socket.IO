var server = require('http').createServer();
var port = process.env.PORT || 15000;
var io = require("socket.io")(server);

let sequenceNumberByClient = new Map();

io.on("connection", (socket) => {
    console.info(`Клієнт приєднався [id=${socket.id}]`);
    sequenceNumberByClient.set(socket, 1);

    socket.on("disconnect", () => {
        sequenceNumberByClient.delete(socket);
        console.info(`Клієнт від'єднався [id=${socket.id}]`);
    });
});

setInterval(() => {
    for (const [client, sequenceNumber] of sequenceNumberByClient.entries()) {
        client.emit("sequenceNumber", sequenceNumber);
        sequenceNumberByClient.set(client, sequenceNumber + 1);
    }
}, 3000);

server.listen(port);