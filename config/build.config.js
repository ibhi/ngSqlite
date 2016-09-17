var fs = require('fs');
var pkg = require('../package.json');

module.exports = {
  filename: 'ngSqlite.js',
  banner:
    '/*!\n' +
    ' * See LICENSE in this repository for license information\n' +
    ' */\n',
  closureStart: '(function(){\n \'use strict\'\n',
  closureEnd: '\n})();',

  dist: 'dist',

  jsFiles: ['src/js/**/*.js'],

  testFiles: ['src/test/**/*.js'],

  versionData: {
    version: pkg.version
  }
};

