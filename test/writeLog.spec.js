var writeLog = require('../lib/writeLog');

describe('writeLog', function() {
  it('should throw if no version number can be found', function(done) {
    var commits = [];
    var options = {
      pkg: 'test/fixtures/_malformation.json'
    };

    writeLog(commits, options, function(err) {
      expect(err).to.equal('No version specified');
      done();
    });
  });
  it('should get the correct version number from package.json', function(done) {
    var commits = [];
    var options = {
      pkg: 'test/fixtures/_package.json'
    };

    writeLog(commits, options, function(err, changelog) {
      expect(err).to.be.a('null');
      expect(changelog).to.contain('1.0.0');
      done();
    });
  });
});
