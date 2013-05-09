/*
 * grunt-r4-closure-checker
 * https://github.com/eredo/r4-grunt-closure-checker
 *
 * Copyright (c) 2013 Eric Schneller (eric@schnellers.name)
 * Licensed under the MIT license.
 */

'use strict';

var checker = require('./lib/checker.js'),
    colors = require('colors');

module.exports = function(grunt) {
  grunt.registerMultiTask('closureCheck', 'Checks the code of the src files for missing requirements.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      printFix: false,
      ignore: []
    });

    var misses = false;
    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // run through the files
      f.src.forEach(function(filepath) {

        // read the content of the file
        var src = grunt.file.read(filepath);
        var missing = checker(src, options.ignore);
        var fix = [];

        for (var i = 0, m; m = missing[i]; i++) {
          grunt.log.errorlns('Missing require of: ' + m.red + ' in ' + filepath.underline.blue);

          if (options.printFix) {
            fix.push('goog.require(\'' + m + '\');');
          }
        }

        if (missing.length > 0) {
          misses = true;
          if (options.printFix) {
            grunt.log.writelns(fix.join('\n'));
          }
        }
      });
    });

    if (misses) {
      grunt.fail.warn('Check requirements.');
    }
  });

};
