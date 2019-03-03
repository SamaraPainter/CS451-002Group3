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
	this.splashScreen = document.getElementById("splashscreen");
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
		for (var i=0; i<this.spaces.length; i++) {
			space[i].node.style.border = "1px solid yellow";
			space[i].node.style.cursor = "cursor";
			space[i].node.onclick = function(e) {}; // reset to blank event
		}
	}

	this.moveOptions = function (spaceId, spaces) {
		coords = spaceIdToIntCoords(spaceId);
		var x = coords[0], y = coords[1];

		for (var i = -8; i < 8; i++) {
			var flips=0;
			for (var j = i; flips < 2; j=-i) { // flip increment to check both diagonal movement axes
				flips++;

				var newX = x+i;
				var newY = y+j;

				var newSpaceId = intCoordsToSpaceId(newX, newY);

				if (!isValidSpace(newSpaceId)) { continue; }

				newSpaceId = intCoordsToSpaceId(newX, newY);

				var isBackwardsSpace = spaces[spaceId].piece.isBlack ? (newY < y) : (newY > y) ;
				if (isBackwardsSpace && !spaces[spaceId].piece.isKing) { // only allow backwards move if king
					continue;
				}

				if (spaces[newSpaceId].piece === null) {
					console.log("piece at "+spaceId+" can move to " + newSpaceId);
					var spaceNode = document.getElementById("space-"+newSpaceId)
					//console.log(spaceNode);
					spaceNode.style.border = "2px solid yellow";
					spaceNode.style.cursor = "pointer";
					var clearMovesFunc = this.clearMoveOptions; // save this to use inside closure;
					spaceNode.onclick = function(e) {
						spaces[spaceId].movePiece(e.target.manager.getSpaceId());

						clearMoveFunc();
					};
				}
			}
		}
	}

	/*
	 * Board is represented as a table
	 */
	this.render = function() {
		var table = document.createElement("TABLE");
		table.setAttribute("id", "checkers-table");
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
		return table;
	}
}

function intCoordsToSpaceId(i, j) {
	return i.toString() + String.fromCharCode(j+64);
}

function spaceIdToIntCoords(spaceId) {
	var i = spaceId[0], j = spaceId[1];
	return [parseInt(i), j.charCodeAt(0)-64];
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

	this.movePiece = function(toSpaceId) {
		var newspace = document.getElementById("space-"+toSpaceId);
		newspace.appendChild(this.piece.node);
		piece.node.parentManager = newspace.manager;
		newspace.manager.piece = piece;
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

	this.moveTo = function(toSpaceIr) {
	}

	this.remove = function() {
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

function Move(startIndex, space) {

}

function computeDiagonalPath(from, to) {
	if (from.length !== 2 || to.length !== 2) { return []; } // improper cell formatting
		
	var fromRow = String.toCharCode(from[0].toLowerCase()) - 65;
	var fromCol; 
	try{ fromCol = parseInt(from[1]); } 
   catch (e) { console.error("could not parse '"+from[1]+"' to int"); return []; }

	var toRow = String.toCharCode(to[0].toLowerCase()) - 65;
	var toCol;
	try{ toCol = parseInt(to[1]); } 
   catch (e) { console.error("could not parse '"+to[1]+"' to int"); return []; }

	// handle cases where path can't be drawn
	if (
		fromRow === toRow || fromCol === toCol
		/* TODO: add other identified edge-cases */
	) { return []; }

	var incr = (fromRow > toRow) && (fromCol > toCol) ? 1 : -1;

	var paths = [];
	while((fromRow > toRow) && (fromCol > toCol)) {

	}
}

document.addEventListener("DOMContentLoaded", function() {
	var gui = new GUI();
	gui.display();
});
