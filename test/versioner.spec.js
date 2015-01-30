var versioner = require('../lib/versioner');

describe('versioner', function () {

  describe('nextVersion', function () {

    it('should increment the major version', function () {
      expect(versioner.nextVersion('2.1.1', 'major')).to.equal('3.0.0');
    });

    it('should increment the minor version', function () {
      expect(versioner.nextVersion('2.1.1', 'minor')).to.equal('2.2.0');
    });

    it('should increment the patch version', function () {
      expect(versioner.nextVersion('2.1.1', 'patch')).to.equal('2.1.2');
    });

    it('should throw an error when a bad bump type is used', function () {
      expect(function () { versioner.nextVersion('2.1.1', 'super') } ).to.throw(Error);
    });

  });

});
