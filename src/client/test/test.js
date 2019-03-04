var assert = chai.assert;

describe('helpers', function() {
	describe('isValidSpace()', function() {
		it('should output true if spaceId is valid [priority: medium]', function() {
			assert.equal(isValidSpace("8H"), true);
		});
		it('should output false if spaceId is invalid [priority: medium]', function() {
			assert.equal(isValidSpace("9Z"), false);
		});
	});
});

describe('Client class', function() {
	describe('render()', function() {

	});
});

describe('GUI class', function() {

});

describe('Board class', function() {

});

describe('Space class', function() {

});

describe('Piece class', function() {

});

describe('Move class', function() {

});
