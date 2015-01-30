function incrementPatch(version) {
  var split = version.split('.');
  split[2] = (parseInt(split[2]) + 1).toString();
  return split.join('.');
}

function incrementMinor(version) {
  var split = version.split('.');
  split[1] = (parseInt(split[1]) + 1).toString();
  split[2] = '0';
  return split.join('.');
}

function incrementMajor(version) {
  var split = version.split('.');
  split[0] = (parseInt(split[0]) + 1).toString();
  split[1] = '0';
  split[2] = '0';
  return split.join('.');
}

exports.nextVersion = function (currentVersion, bump) {
  switch (bump) {
    case 'major':
      return incrementMajor(currentVersion);
    case 'minor':
      return incrementMinor(currentVersion);
    case 'patch':
      return incrementPatch(currentVersion);
    default:
      throw new Error('Invalid bump value - please use major, minor, or patch');
  }
};
