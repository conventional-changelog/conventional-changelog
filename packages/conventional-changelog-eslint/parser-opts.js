'use strict';

module.exports = {
  headerPattern: /^(\w*)\: (.*?)(?:\((.*)\))?$/,
  headerCorrespondence: [
    `tag`,
    `message`
  ]
};
