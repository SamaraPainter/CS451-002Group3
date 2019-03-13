var clientIsBlack = true;
var clientsTurn = false;

function Client() {
	this.socket = new WebSocket("ws://" + window.location.hostname + ":8081");

	this.myTurn = false;

	this.socket.onopen = function () {
		alert("Communication with server established");
	};

	this.socket.onclose = function () {
		alert("Connection to server lost");
	};

	this.socket.onerror = function (e) {
		alert("Server crashed...");
	};

	this.socket.onmessage = function (msg) { // msg.data is a stringified object
		var data = JSON.parse(msg.data);
		console.log(msg.data);
		clientsTurn = msg.currPlayerIsBlack === clientIsBlack;
		if (data.gamerunning) {
			msg.target.close();
			alert("A game is already in progress...");
		} else if (data.matched) {
			console.log("matched !");
			clientIsBlack = data.isBlack;
			if(clientIsBlack) { 
				client.myTurn = true;
				document.getElementById("color-indicator").innerHTML += "Black";
				document.getElementById("color-indicator").style.backgroundColor = "black";
			} else {
				toggleNode(document.getElementById("table-overlay"));
				document.getElementById("color-indicator").innerHTML += "Red";
				document.getElementById("color-indicator").style.backgroundColor = "red";
			}
			var pieceNodes = document.querySelectorAll(".piece");
			for (var i = 0; i < pieceNodes.length; i++) {
				if (clientIsBlack == this.isBlack) {
					pieceNodes[i].style.cursor = "pointer";
				}
				pieceNodes[i].onclick = function (e) {
					if (clientIsBlack == e.target.manager.isBlack) { // if client and piece are the same color
						client.gui.gameBoard.moveOptions(e.target.parentManager.getSpaceId(), client.gui.gameBoard.spaces);
						e.target.style.cursor = "pointer";
					}
				};
			}
			alert(msg.data);
		} else if (data.resigned) {
			msg.target.close();
			alert("Your opponent resigned... You win!");
		} else if (data.pieceCaptured) {
			client.myTurn = !client.myTurn;
			toggleNode(document.getElementById("table-overlay"));
			msg.target.close();
			alert("a piece was captured");
		} else if (data.opponentMoved) {
			client.myTurn = !client.myTurn;
			toggleNode(document.getElementById("table-overlay"));
			var m = new Move();
			m.fromJson(data);
			m.makeMove();
		} else {
			alert(msg.data);
		}
	};

	this.sendMessage = function (msg) {
		// if (msg.move) {
		// 	clientsTurn = false;
		// 	toggleNode(document.getElementById("table-overlay").style.display)
		// }
		this.socket.send(JSON.stringify(msg));
	};

	this.gui = null;

	this.getGUI = function () {
		if (this.gui === null) {
			this.gui = new GUI();
		}
		return this.gui;
	};
}

function offset(el) {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	 var top = rect.top + scrollTop; 
	 var left = rect.left + scrollLeft; 
    return {
		 top: top.toString() + 'px',
		 left: left.toString() + 'px',
		 height: rect.height.toString() + 'px',
		 width: rect.width.toString() + 'px',
	 };
}

function GUI() {
	this.gameBoard = new Board();
	this.splashScreen = document.createElement("DIALOG");
	this.splashScreen.id = "splashscreen";
	// document.body.appendChild(this.splashScreen);
	// this.splashScreen.close();

	this.display = function (boardState = null) {
		if (this.gameBoard === null) { this.gameBoard = new Board(); }
		document.getElementById("board-container").appendChild(this.gameBoard.render());
		var tableOffset = offset(this.gameBoard.node);
		document.getElementById("table-overlay").style.top = tableOffset.top;
		document.getElementById("table-overlay").style.left = tableOffset.left;
		document.getElementById("table-overlay").style.height = tableOffset.height;
		document.getElementById("table-overlay").style.width = tableOffset.width;
		document.body.appendChild(this.splashScreen);
	};

	this.blackScore = 0;
	this.redScore = 0;
	this.updateScore = function (pieceVal, isBlack) {
		if (isBlack) {
			document.getElementById("reds-score").innerHTML += pieceVal;
			this.redScore++;
		} else {
			document.getElementById("blacks-score").innerHTML += pieceVal;
			this.blackScore++;
		}

		if (this.blackScore >= 12) {
			document.getElementById("table-overlay").style.display = "block";
			document.getElementById("table-overlay-text").innerHTML = "Black Wins!";
		} else if (this.redScore >= 12) {
			document.getElementById("table-overlay").style.display = "block";
			document.getElementById("table-overlay-text").innerHTML = "Red Wins!";
		}
	};
}

function isValidSpace(spaceId) {
	if (spaceId.length > 2) { return false; }
	var intCoords = spaceIdToIntCoords(spaceId);
	return (
		(intCoords[0] > 0 && intCoords[0] < 9) &&
		(intCoords[1] > 0 && intCoords[1] < 9)
	);
}

function Board() {
	this.spaces = {};

	for (var i = 1; i <= 8; i++) {
		for (var j = 1; j <= 8; j++) {
			var xPos = intCoordsToSpaceId(i, j)[0];
			var yPos = intCoordsToSpaceId(i, j)[1];

			var isDarkSpace = (i + j) % 2 == 0 ? "white" : "grey";

			var piece = null;
			if ((yPos === "A" || yPos === "B" || yPos === "C") && isDarkSpace == "grey") {
				piece = new Piece(true, false, xPos + yPos);
			} else if ((yPos === "F" || yPos === "H" || yPos === "G") && isDarkSpace == "grey") {
				piece = new Piece(false, false, xPos + yPos);
			}

			var space = new Space(xPos, yPos, isDarkSpace, piece);
			this.spaces[xPos + yPos] = space;
		}
	}

	this.boardState = function () {
		return this.spaces;
	};

	this.clearMoveOptions = function () {
		var keys = Object.keys(this.spaces);
		for (var i = 0; i < keys.length; i++) {
			this.spaces[keys[i]].node.style.border = "2px solid black";
			this.spaces[keys[i]].node.style.cursor = "default";
			this.spaces[keys[i]].node.onclick = function (e) { }; // reset to blank event
		}
	};

	// passes in the spaceId of the starting space, the current spaces on the board and,
	// if the moveOptions are being recorderd on a jump, return the props of the jumping piece
	this.moveOptions = function (spaceId, spaces, jumpPieceProps = null) {
		coords = spaceIdToIntCoords(spaceId);
		var x = coords[0], y = coords[1];

		var moves = [];
		var moveSpace = null;

		for (var i = -1; i <= 1; i++) {
			if (i === 0) { continue; }

			var flips = 0;
			for (var j = i; flips < 2; j = -i) { // flip increment to check both diagonal movement axes
				flips++;

				var newX = x + i; var newY = y + j;
				var newSpaceId = intCoordsToSpaceId(newX, newY);
				if (!isValidSpace(newSpaceId)) { continue; }
				// newSpaceId = intCoordsToSpaceId(newX, newY);

				var isBlack, isKing;
				if (jumpPieceProps === null) { // don't bother checking jumpProps is null
					isBlack = spaces[spaceId].piece.isBlack;
					isKing = spaces[spaceId].piece.isKing;
				} else {
					isKing = jumpPieceProps.isKing;
					isBlack = jumpPieceProps.isBlack;
				}

				var isBackwardsSpace = isBlack ? (newY < y) : (newY > y);
				if (isBackwardsSpace && !isKing) { continue; } // only allow backwards move if king

				var captureAllowed = !!spaces[newSpaceId].piece ? (spaces[newSpaceId].piece.isBlack && !isBlack) || (!spaces[newSpaceId].piece.isBlack && isBlack) : false;
				if (spaces[newSpaceId].piece === null && jumpPieceProps === null) {  // only allow regular move if not inside jump

					var move = new Move(); // (spaces[spaceId], [spaces[newSpaceId]]);
					move.addSteps([new MoveStep(spaces[newSpaceId], spaces[spaceId], null)]);
					spaces[newSpaceId].highlightMove(spaces[spaceId], move);

					moves.push(move);
				} else if (captureAllowed) {
					var jumpSpaceId = intCoordsToSpaceId(newX + i, newY + j);
					if (!isValidSpace(jumpSpaceId)) { continue; }
					if (spaces[jumpSpaceId].piece === null) {
						var boardObj = document.getElementById("checkers-board").manager;
						var jumpMoves = boardObj.moveOptions(jumpSpaceId, spaces, { isBlack: isBlack, isKing: isKing });

						var move = new Move();
						move.addSteps([new MoveStep(spaces[jumpSpaceId], spaces[spaceId], spaces[newSpaceId].piece)]);

						for (var k = 0; k < jumpMoves.length; k++) {
							move.addSteps(jumpMoves[k].moveSteps);
						}

						spaces[jumpSpaceId].highlightMove(spaces[spaceId], move);
						moveSpace = spaces[jumpSpaceId]

						moves.push(move);
					}
				}
			}
		}

		if (moves.length === 1 && !!moveSpace) {
			moveSpace.node.click()
		}

		return moves;
	};

	/*
	 * Board is represented as a table
	 */
	this.render = function () {
		var table = document.createElement("TABLE");
		table.setAttribute("id", "checkers-board");
		for (var i = 1; i <= 8; i++) {
			var tr = document.createElement("TR");
			tr.setAttribute("id", "row-" + i.toString());
			for (var j = 1; j <= 8; j++) {
				var spaceId = intCoordsToSpaceId(i, j);
				var spaceNode = this.spaces[spaceId].render();
				if (spaceNode.children.length === 1) {
					var pieceNode = spaceNode.children[0];
					// proxy this.moveOptions and this.spaces because of closure
					var moveOptions = this.moveOptions;
					var spaces = this.spaces;
					pieceNode.onclick = function (e) {
						if (clientIsBlack == e.target.manager.isBlack) { // if client and piece are the same color
							moveOptions(e.target.parentManager.getSpaceId(), spaces);
						}
					}
				}
				tr.appendChild(spaceNode);
			}
			table.appendChild(tr);
		}

		table.manager = this;
		this.node = table;

		return table;
	};
}

function Space(xPos, yPos, isDarkSpace, piece = null) {
	this.xPos = xPos;
	this.yPos = yPos;
	this.isDarkSpace = isDarkSpace;
	this.piece = piece;

	this.toJson = function () {
		return {
			xPos: this.xPos,
			yPos: this.yPos,
			isDarkSpace: this.isDarkSpace,
			piece: !!this.piece ? this.piece.toJson() : null
		}
	};

	this.fromJson = function (obj) {
		this.xPos = obj.xPos;
		this.yPos = obj.yPos;
		this.isDarkSpace = obj.isDarkSpace;
	};

	this.getSpaceId = function () {
		return this.xPos + this.yPos;
	};

	this.validate = function () {
		// TODO: fix stub
		return true;
	};

	this.movePiece = function (toSpace) {
		var newspace = document.getElementById("space-" + toSpace.getSpaceId());
		// var newspace = toSpace.node;
		newspace.appendChild(this.piece.node);
		newspace.manager.piece = this.piece;
		this.piece.node.parentManager = newspace.manager;
		this.piece = null;
	};

	this.highlightMove = function (fromSpace, move) {
		if (!client.myTurn) {
			return;
		}
		this.node.style.border = "2px solid yellow";
		this.node.style.cursor = "pointer";

		this.node.onclick = function (e) {
			var boardObj = document.getElementById("checkers-board").manager;
			boardObj.clearMoveOptions();

			move.makeMove();
			client.sendMessage(move.toJson());
			client.myTurn = !client.myTurn;
			toggleNode(document.getElementById("table-overlay"));
		};
	};

	this.render = function () {
		var td = document.createElement("TD");

		var spaceId = this.getSpaceId();
		var coords = spaceIdToIntCoords(spaceId);

		var bgColor = (coords[0] + coords[1]) % 2 == 0 ? "white" : "grey";
		var color = (coords[0] + coords[1]) % 2 == 0 ? "grey" : "white";
		td.setAttribute("style", "background-color:" + bgColor + "; color:" + color + "; height:20px; width:20px; border: 2px solid black;");

		td.setAttribute("id", "space-" + spaceId[0] + spaceId[1]);
		td.innerHTML = "<div> </div>";

		if (this.piece !== null) {
			td.innerHTML = "";
			var pieceNode = this.piece.render();
			pieceNode.parentManager = this;
			td.appendChild(pieceNode);
		}

		td.manager = this;
		this.node = td;

		return td;
	};

}

function Piece(isBlack, isKing, id) {
	this.isBlack = isBlack;
	this.isKing = isKing;
	this.id = id;

	this.remove = function () {
		this.node.remove();
		this.node.parentManager.piece = null;
	};

	this.makeKing = function () {
		// king piece is represented by HTMl entity
		if (isBlack) {
			this.node.innerHTML = "&#9818;";
		} else {
			this.node.innerHTML = "&#9812;";
		}
		this.isKing = true;
	};

	this.render = function () {
		var piece = document.createElement("div");

		piece.innerHTML = "&#x25C9;"; // piece is represented as circle HTML entity
		if (this.isKing) {
			piece.innerHTML = "&#x1F451;"; // king piece is represented as crown HTML entity
		}

		piece.style.color = "red";
		if (this.isBlack) {
			piece.style.color = "black";
		}

		piece.id = "piece-" + this.id;

		piece.classList.add("piece");

		piece.manager = this;
		this.node = piece;

		return piece;
	};

	this.toJson = function () {
		return {
			isBlack: this.isBlack,
			isKing: this.isKing,
			id: this.id,
		};
	};

	this.fromJson = function (obj) {
		this.isBlack = obj.isBlack;
		this.isKing = obj.isKing;
		this.node = document.getElementById("piece-" + obj.id);
	};

}

function MoveStep(to, from, captured) {
	this.to = to;
	this.from = from;
	this.captured = captured;

	this.toJson = function () {
		return {
			to: this.to.toJson(),
			from: this.from.toJson(),
			captured: !!this.captured ? this.captured.toJson() : null
		};
	};
}

function Move() {
	this.moveSteps = [];

	this.addSteps = function (steps) {
		for (var i = 0; i < steps.length; i++) {
			this.moveSteps.push(steps[i]);
		}
	};

	this.makeMove = function () {
		for (var i = 0; i < this.moveSteps.length; i++) {
			var from = this.moveSteps[i].from;
			var to = this.moveSteps[i].to;
			from.movePiece(to);
			if (!!this.moveSteps[i].captured) {
				this.moveSteps[i].captured.node.remove(); //remove();
				this.moveSteps[i].captured.node.parentManager.piece = null; //remove();
				var pieceVal = this.moveSteps[i].captured.node.innerHTML;
				var pieceIsBlack = this.moveSteps[i].captured.isBlack;
				client.gui.updateScore(pieceVal, pieceIsBlack);
			}

			// check if piece has reached the other side after the move and king it
			var y = spaceIdToIntCoords(to.getSpaceId())[1];
			if ((y == 8 && to.piece.isBlack) || (y == 1 && !to.piece.isBlack)) {
				to.piece.makeKing();
			}
		}
	};

	this.toJson = function () {
		var obj = { steps: [], opponentMoved: true };
		for (var i = 0; i < this.moveSteps.length; i++) {
			obj.steps.push(this.moveSteps[i].toJson());
		}
		return obj;
	};

	this.fromJson = function (obj) {
		for (var i = 0; i < obj.steps.length; i++) {
			var toSpaceId = obj.steps[i].to.xPos + obj.steps[i].to.yPos;
			var to = document.getElementById("space-" + toSpaceId).manager;

			var fromSpaceId = obj.steps[i].from.xPos + obj.steps[i].from.yPos;
			var from = document.getElementById("space-" + fromSpaceId).manager;

			// var captured = !!obj.steps[i].captured ? new Piece(obj.steps[i].captured.isBlack, obj.steps[i].captured.isKing) : null;

			var captured = null;
			if(!!obj.steps[i].captured) {
				captured = document.getElementById("piece-" + obj.steps[i].captured.id).manager;
				captured.node = document.getElementById("piece-" + obj.steps[i].captured.id);
				captured.isBlack = obj.steps[i].captured.isBlack;
				captured.isKing = obj.steps[i].captured.isKing;
			}

			var s = new MoveStep(to, from, captured);
			this.moveSteps.push(s);
		}
	};
}

function intCoordsToSpaceId(i, j) {
	return i.toString() + String.fromCharCode(j + 64);
}

function spaceIdToIntCoords(spaceId) {
	var i = spaceId[0], j = spaceId[1];
	return [parseInt(i), j.charCodeAt(0) - 64];
}

function toggleNode(el) {
	if(el.style.display == 'block') {
		el.style.display = 'none';
	} else {
		el.style.display = 'block';
	}
}
