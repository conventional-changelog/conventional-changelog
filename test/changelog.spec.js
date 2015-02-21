var changelog = require('../index');

describe('changelog', function() {
  it('should generate a changelog', function(done) {
    changelog({
      log: function() {}
    }, function(err, log) {
      expect(err).to.be.a('null');
      expect(log).not.to.be.a('null');
      done();
    });
  });
});
