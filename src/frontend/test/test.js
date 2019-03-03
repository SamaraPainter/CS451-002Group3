describe('helpers', function() {
	describe('isValidSpace()', function{} {
		it('should output true if spaceId is valid', function() {
			assert.equal(isValidSpace("8H"), true);
		});
		it('should output true if spaceId is valid', function(done) {
			assert.equal(isValidSpace("9Z"), true);
		});
	});
});
