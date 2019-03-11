var assert = chai.assert;
var expect = chai.expect;

describe('Client class', function() {
	describe('render()', function() {

	});
});

describe('GUI class', function() {
});

describe('Board class', function() {
	var board = new Board();
	var node = board.render();

	describe('render()', function() {
		it('should return TABLE as top-level node [priority: medium]', function() {
			assert.equal(node.nodeName, "TABLE");
		});
		it('should contain 64 spaces represented as TD nodes [priority: medium]', function() {
			assert.equal(node.querySelectorAll("td").length, 64);
		});
	});


	describe('clearMoveOptions()', function() {
		it('should unhighlight all spaces [priority: medium]', function() {
			board.moveOptions("2B", board.spaces);
			board.clearMoveOptions();
			assert.equal(node.querySelectorAll('td[style*="border-color: yellow"]').length, 0);
		});

		it('should remove onclick event and cursor change [priority: medium]', function() {

		});
	});

	describe('moveOptions()', function() {
		var moveOptions = board.moveOptions("2B", board.spaces);
		it('basic moveOptions returns two moves [priority: medium]', function() {
			assert.equal(node.querySelectorAll('td[style*="border-color: yellow"]').length, 0);
		});

		it('should remove onclick event and cursor change [priority: medium]', function() {

		});
	});

});

describe('Space class', function() {
	var space = new Space("1","A", true, null);
	var node = space.render();

	describe('render()', function() {
		it('should return TD as top-level node [priority: medium]', function() {
			assert.equal(node.nodeName, "TD");
		});
	});

	describe('higlightSpace()', function() {
		var fromSpace = new Space("2", "B", true, new Piece(true, true));

		space.highlightMove(fromSpace);

		it('should make space yellow [priority: medium]', function() {
			assert.equal(space.node.style.borderColor, "yellow");	
		});	

		it('should make cursor into pointer [priority: low]', function() {
			assert.equal(space.node.style.cursor, "pointer");	
		});	
	})

	var properties = [
		{ name: "xPos", assertions: [
			function(val) {
				console.log(val)
				return {
					name: "xPos should be number", returnVal: !isNaN(val),
				}
			},
			function(val) {
				return {
					name: "xPos should be between 1 & 8", returnVal: parseInt(val) > 0 && parseInt(val) < 8,
				}
			}
		] },
		{ name: "yPos", assertions: [] },
		{ name: "isDarkSpace", assertions: [] },
		{ name: "piece", assertions: [] },
		{ name: "node", assertions: [] },
		// { name: "toJson", assertions: [] },
		// { name: "fromJson", assertions: [] },
		// { name: "getSpaceId", assertions: [] },
		// { name: "movePiece", assertions: [] },
		// { name: "highlightMove", assertions: [] },
	];

	propertyTest(space, properties);
});

describe('Piece class', function() {

	var properties = [
		{ name: "remove", assertions: [] },
		{ name: "makeKing", assertions: [] },
		{ name: "toJson", assertions: [] },
		{ name: "render", assertions: [] },
	];

	propertyTest(move, properties);
});

describe('Move class', function() {
	var move = new Move();

	var properties = [
		{ name: "moveSteps", assertions: [] },
		/*  ignore
		   { name: "addSteps", assertions: [] },
			{ name: "makeMove", assertions: [] },
			{ name: "toJson", assertions: [] },
			{ name: "fromJson", assertions: [] },
		*/ 
	];

	propertyTest(move, properties);
});

describe('Helpers', function() {
	describe('isValidSpace()', function() {
		it('should output true if spaceId is valid [priority: medium]', function() {
			assert.equal(isValidSpace("8H"), true);
		});
		it('should output false if spaceId is invalid [priority: medium]', function() {
			assert.equal(isValidSpace("9Z"), false);
		});
	});
	var properties = ["xPos", "yPos", "isDarkSpace", "piece", "node"];
});

function propertyTest(obj, properties) {
	describe('property tests', function() {
		for (var i=0; i < properties.length; i++) {
			var currProp = properties[i];
			it('should have property \''+currProp.name+'\' [priority: low]', function() {
				expect(obj).to.have.property(currProp.name);
			});	

			for (var j=0; j < currProp.assertions.length; j++) {
				var assertionObj = currProp.assertions[j](obj[currProp]);
				console.log(obj);
				it('property \''+currProp.name+'\ should fulfil assertion \''+ assertionObj.name + '\'', function() {
					console.log(assertionObj);
					assert.equal(assertionObj.returnVal, true);
				});
			}
		}
	});
}
