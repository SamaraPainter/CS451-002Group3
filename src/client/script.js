function Client() {
	this.clientIsBlack = true;

	this.joinGame = function() {
		const http = new XMLhttpRequest();
		const url='google.com'; // TODO: change placeholder 
		http.open("GET", url);
		http.send();
		http.onreadystatechange = function (e) {
			var response = JSON.parse(http.responseText);
			this.clientIsBlack = response.clientIsBlack;
		}
	}

	this.sendMessage = function(msg) {
		const http = new XMLhttpRequest();
		const url='google.com'; // TODO: change placeholder 
		http.open("GET", url);
		http.send();
		http.onreadystatechange= function (e) {
			console.log(http.responseText);
		}
	}

	this.recieveMessage = function(msg) {
		const http = new XMLhttpRequest();
		const url='google.com'; // TODO: change placeholder 
		http.open("GET", url);
		http.send();
		http.onreadystatechange = function (e) {
			console.log(http.responseText);
		}
	}
}

function GUI() {
	this.gameBoard = new Board();
	this.splashScreen = document.createElement("DIALOG");
	this.splashScreen.id = "splashscreen";
	document.body.appendChild(this.splashScreen);
	this.splashScreen.close();

	this.display = function(boardState=null) {
		if (this.gameBoard === null) { this.gameBoard = new Board() }
		document.body.appendChild(this.gameBoard.render());
		document.body.appendChild(this.splashScreen);
	}

	this.selectPiece = function(coord) {

	}
}

function isValidSpace(spaceId) {
	if(spaceId.length > 2) { return false; }
	var intCoords = spaceIdToIntCoords(spaceId);
	return (
		(intCoords[0] > 0 && intCoords[0] < 9) &&
		(intCoords[1] > 0 && intCoords[1] < 9)
	);
}

function Board() {
	this.spaces = {};

	for (var i=1; i<=8; i++) {
		for (var j=1; j<=8; j++) {
			var xPos = intCoordsToSpaceId(i, j)[0]; 
			var yPos = intCoordsToSpaceId(i, j)[1]; 

			var isDarkSpace = (i+j)%2==0 ? "white" : "grey";

			var piece = null;
			if (yPos === "A" || yPos === "B") { 
				piece = new Piece(true, false);
			} else if (yPos === "H" || yPos === "G") {
				piece = new Piece(false, false);
			}

			var space = new Space(xPos, yPos, isDarkSpace, piece);
			this.spaces[xPos+yPos] = space;
		}
	}

	this.boardState = function() {
		return this.spaces;
	}

	this.clearMoveOptions = function() {
		// console.log("clearing spaces");
		var keys = Object.keys(this.spaces);
		for (var i=0; i<keys.length; i++) {
			this.spaces[keys[i]].node.style.border = "2px solid black";
			this.spaces[keys[i]].node.style.cursor = "default";
			this.spaces[keys[i]].node.onclick = function(e) {}; // reset to blank event
		}
	}
	
	// passes in the spaceId of the starting space, the current spaces on the board and,
	// if the moveOptions are being recorderd on a jump, return the props of the jumping piece
	this.moveOptions = function (spaceId, spaces, jumpPieceProps=null) {
		coords = spaceIdToIntCoords(spaceId);
		var x = coords[0], y = coords[1];

		var moves = [];

		for (var i = -1; i <= 1; i++) {
			if (i === 0) { continue; }

			var flips=0;
			for (var j = i; flips < 2; j=-i) { // flip increment to check both diagonal movement axes
				flips++;

				var newX = x+i; var newY = y+j;
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

				var isBackwardsSpace = isBlack ? (newY < y) : (newY > y) ;
				if (isBackwardsSpace && !isKing) { continue; } // only allow backwards move if king

				var captureAllowed = !!spaces[newSpaceId].piece ? (spaces[newSpaceId].piece.isBlack && !isBlack) || (!spaces[newSpaceId].piece.isBlack && isBlack) : false;
				if (spaces[newSpaceId].piece === null && jumpPieceProps === null) {  // only allow regular move if not inside jump

					var move = new Move(); // (spaces[spaceId], [spaces[newSpaceId]]);
					move.addSteps([new MoveStep(spaces[newSpaceId], spaces[spaceId], null)]);
					spaces[newSpaceId].highlightMove(spaces[spaceId], move);

					moves.push(move);
				} else if (captureAllowed){
					var jumpSpaceId = intCoordsToSpaceId(newX+i, newY+j);
					if (!isValidSpace(jumpSpaceId)) { continue; }
					if(spaces[jumpSpaceId].piece === null) {
						var boardObj = document.getElementById("checkers-board").manager;
						var jumpMoves = boardObj.moveOptions(jumpSpaceId, spaces, {isBlack: isBlack, isKing: isKing});

						var move = new Move();
						move.addSteps([new MoveStep(spaces[jumpSpaceId], spaces[spaceId], spaces[newSpaceId].piece)]);

						for (var k = 0; k < jumpMoves.length; k++) {
							move.addSteps(jumpMoves[k].moveSteps);
						}

						spaces[jumpSpaceId].highlightMove(spaces[spaceId], move);
						
						moves.push(move);
					}
				}
			}
		}

		return moves; 
	}

	/*
	 * Board is represented as a table
	 */
	this.render = function() {
		var table = document.createElement("TABLE");
		table.setAttribute("id", "checkers-board");
		// table.setAttribute("border", "1px black");
		console.log(this.spaces);
		for (var i=1; i<=8; i++) {
			var tr = document.createElement("TR");
			tr.setAttribute("id", "row-"+i.toString());
			for (var j=1; j<=8; j++) {
				var spaceId = intCoordsToSpaceId(i, j);
				var spaceNode = this.spaces[spaceId].render();
				if (spaceNode.children.length === 1) {
					var pieceNode = spaceNode.children[0];
					// proxy this.moveOptions and this.spaces because of closure
					var moveOptions = this.moveOptions; 
					var spaces = this.spaces;
					pieceNode.onclick = function(e) {
						moveOptions(e.target.parentManager.getSpaceId(), spaces);
					}
				}
				tr.appendChild(spaceNode);
			}
			table.appendChild(tr);
		}

		table.manager = this;
		this.node = table;

		return table;
	}
}

function Space(xPos, yPos, isDarkSpace, piece=null) {
	this.xPos = xPos;
	this.yPos = yPos;
	this.isDarkSpace = isDarkSpace;
	this.piece = piece;

	this.getSpaceId = function() {
		return this.xPos+this.yPos;
	}

	this.validate = function() {
		// TODO: fix stub
		return true;
	}

	this.movePiece = function(toSpace) {
		// var newspace = document.getElementById("space-"+toSpaceId);
		var newspace = toSpace.node;
		newspace.appendChild(this.piece.node);
		newspace.manager.piece = this.piece;
		this.piece.node.parentManager = newspace.manager;
		this.piece = null;
	}

	this.highlightMove = function(fromSpace, move) {
		this.node.style.border = "2px solid yellow";
		this.node.style.cursor = "pointer";

		this.node.onclick = function(e) {
			var boardObj = document.getElementById("checkers-board").manager;
			boardObj.clearMoveOptions();

			move.makeMove();
		};
	}

	this.render = function() {
		var td = document.createElement("TD");

		var spaceId = this.getSpaceId();
		var coords = spaceIdToIntCoords(spaceId);

		var bgColor = (coords[0]+coords[1])%2==0 ? "white" : "grey";
		var color = (coords[0]+coords[1])%2==0 ? "grey" : "white";
		td.setAttribute("style", "background-color:"+bgColor+"; color:"+color+"; height:20px; width:20px; border: 2px solid black;");

		td.setAttribute("id", "space-"+spaceId[0]+spaceId[1]);
		td.innerHTML= "<div> </div>";

		if (this.piece !== null) {
			td.innerHTML = "";
			var pieceNode = this.piece.render();
			pieceNode.parentManager = this;
			td.appendChild(pieceNode);
		}

		td.manager = this;
		this.node = td;

		return td;
	}

}

function Piece(isBlack, isKing) {
	this.isBlack = isBlack;
	this.isKing = isKing;

	this.remove = function() {
		this.node.remove();
	}

	this.makeKing = function() {
		// king piece is represented by HTMl entity
		if (isBlack) {
			this.node.innerHTML = "&#9818;"; 
		} else {
			this.node.innerHTML = "&#9812;";
		}
	}

	this.render = function() {
		var piece = document.createElement("div");

		piece.innerHTML = "&#x25C9;"; // piece is represented as circle HTML entity
		if (this.isKing) { 
			piece.innerHTML = "&#x1F451;"; // king piece is represented as crown HTML entity
		}

		piece.style.color = "red";
		if (this.isBlack) {
			piece.style.color = "black";
		}

		piece.style.cursor = "pointer";

		piece.manager = this;
		this.node = piece;

		return piece;
	}

}

function MoveStep(to, from, captured) {
	this.to = to;
	this.from = from;
	this.captured = captured;
}

function Move() { 
	this.moveSteps = [];

	this.addSteps = function(steps) {
		for(var i = 0; i < steps.length; i++) {
			this.moveSteps.push(steps[i]);
		}
	}

	this.makeMove = function() {
		for (var i = 0; i < this.moveSteps.length; i++) {
			var from = this.moveSteps[i].from;
			var to = this.moveSteps[i].to;
			from.movePiece(to);
			if (!!this.moveSteps[i].captured) {
				this.moveSteps[i].captured.remove();
			}

			// check if piece has reached the other side after the move and king it
			var y = spaceIdToIntCoords(to.getSpaceId())[1];
			if ((y == 8 && to.piece.isBlack) || (y == 1 && !to.piece.isBlack)) {
				to.piece.makeKing();
			}
		}
	}
}

function intCoordsToSpaceId(i, j) {
	return i.toString() + String.fromCharCode(j+64);
}

function spaceIdToIntCoords(spaceId) {
	var i = spaceId[0], j = spaceId[1];
	return [parseInt(i), j.charCodeAt(0)-64];
}
