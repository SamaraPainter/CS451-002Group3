var players = [null, null];
var currPlayer = 0;
// ------------------------ webSocket Server event functions
var WebSocketServer = require('ws').Server;   // include the webSocket library

// configure the webSocket server:
const wsSERVER_PORT = 8081;                 // port number for the webSocket server
var wss = new WebSocketServer({ port: wsSERVER_PORT }); // the webSocket server

var sendJsonMessage = function (ws, json) {
    ws.send(JSON.stringify(json));
}

var sendStringMessage = function (ws, str) {
    ws.send(JSON.stringify({ message: str }));
}

var onPlayerMessage = function (event) {
    if (players[currPlayer] === event.target) { // a message from the current player
        currPlayer = (currPlayer + 1) % 2;
        players[currPlayer].send(event.data);
    } else {
        sendStringMessage(event.target, "Wait for your turn!");
    }
}

var onPlayerClose = function (event) {
    if (players[0] === event.target) {
        players[0] = null;
        if (players[1]) {
            players[1].send(JSON.stringify({ resigned: true }), (error) => {
                console.log('Client 0 connection unexpectedly closed');
                if (error) {
                    console.log("ERROR: " + error.message);
                }
            });
        }
    } else {
        players[1] = null;
        if (players[0]) {
            players[0].send(JSON.stringify({ resigned: true }), (error) => {
                console.log('Client 1 connection unexpectedly closed');
                if (error) {
                    console.log("ERROR: " + error.message);
                }
            });
        }
    }
}

// returns false if a game is in progress
var joinGame = function (client) {
    if (!players[0]) { // first client connects
        console.log("Player 0 connected");
        players[0] = client;
        sendStringMessage(client, "You requested to play! Waiting for opponent...");
        players[0].onmessage = function (event) {
            sendStringMessage(players[0], "Still waiting for an opponent...");
        }
        players[0].onclose = function () {
            players[0] = null;
        }
        return true;
    } else if (!players[1]) { // second client connected
        console.log("Player 1 connected");
        players[1] = client;
        // sendStringMessage(players[0], "Opponent Found! Your turn!");
        sendJsonMessage(players[0], {
			  message: "Opponent Found! Your turn!",
			  matched: true,
			  isBlack: true
		  });

        // sendStringMessage(players[1], "Opponent Found! Your opponent's turn");
        sendJsonMessage(players[1], {
			  message: "Opponent Found! Your opponent's turn!",
			  matched: true,
			  isBlack: false
		  });
        currPlayer = 0;
        players[0].onmessage = onPlayerMessage;
        players[1].onmessage = onPlayerMessage;
        players[0].onclose = onPlayerClose;
        players[1].onclose = onPlayerClose;
        return true;
    } else {
        console.log("A third player tried to join game...");
        return false;
    }
}

wss.on('connection', function (client) {
    if (!joinGame(client)) { // a game is already in progress
        client.send(JSON.stringify({ gamerunning: true }));
    }
});


// --------------------------- Express server ----------
var express = require('express');
var app = express();
//used to serve static pages
app.use(express.static("./client"));

app.listen(8080, function () {
    console.log('web-server running on port 8080 ...');
});
