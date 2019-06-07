const express = require('express');
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const bodyParser = require('body-parser');
const moment = require('moment');
const fs = require("fs");

io.on('connection', (socket) => {
    console.log("User has connected!");
    io.emit('send message', messages);

    socket.on('new message', (message) => {
        messages.push({
            name: message.name,
            message: message.message,
            //timestamp: newDate()
        });
        console.log(messages);
        io.emit('send message', messages);
    });
});

app.use(bodyParser.json());

let messages = [];

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.put("/send", (req, res) => {
    messages.push({
        name: req.body.name,
        message: req.body.message,
        timestamp: new Date()
    });

    console.log(messages);

    res.send({ status: "ok" });
});

app.get("/receive", (req, res) => {
    res.send({ messages: messages });
});

app.get("/save", (req, res) => {
    let toSave = "";
    for (const message of messages) {
        toSave += `${message.name} (${moment(message.timestamp).format("LT")}): ${message.message}\n`;
    }
    fs.writeFileSync(__dirname + "/message.txt", toSave);

    res.send({ message: "ok" });
});

/*app.listen(8081, () => {
    console.log("Server is running");
}); */

http.listen(8081);

//nodemon index.js
//127.0.0.1:8081