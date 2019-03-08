var assert = chai.assert;

describe('Client class', function() {
	describe('render()', function() {

	});
});

describe('GUI class', function() {
});

describe('Board class', function() {
	describe('render()', function() {
		var board = new Board();
		var node = board.render();

		it('should return TABLE as top-level node [priority: medium]', function() {
			assert.equal(node.nodeName, "TABLE");
		});
		it('should contain 64 spaces represented as TD nodes [priority: medium]', function() {
			assert.equal(node.querySelectorAll("td").length, 64);
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

	describe('clearMoveOptions()', function() {
		// it('should unhighlight all spaces [priority: medium]', function() {

		// });

		// it('should remove onclick event and cursor change [priority: medium]', function() {

		// });
	});

	describe('higlightSpace()', function() {
		var fromSpace = new Space("2", "B", true, new Piece(true, true));

		space.highlightMove(fromSpace);

		// it('should make spaces yellow [priority: medium]', function() {
		// 	
		// });	

		// it('should make cursor into pointer [priority: low]', function() {

		// });	

		// it('should add event handler to space [priority: low]', function() {

		// });	
	})

	describe('property tests [priority: medium]', function() {
		
	})
});

describe('Piece class', function() {

});

describe('Move class', function() {

	describe('property tests [priority: medium]', function() {
		
	})
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
});
