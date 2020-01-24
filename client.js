const io = require("socket.io-client");
clientIO = io.connect("http://localhost:15000");
clientIO.on("sequenceNumber", (msg) => console.info(msg));