'use strict';

var grunt = require('grunt'),
    path =  require('path'),
    checker = require(path.join(__dirname, '..', 'tasks', 'lib', 'checker.js'));

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.r4_closure_checker = {

  'missings': function(test) {
    test.expect(2);

    var src = grunt.file.read(path.join(__dirname, 'test_missing_style.js'));
    var missing = checker(src);
    test.ok(missing.length && missing[0] === 'goog.style', 'goog.style should be missing.');

    var src = grunt.file.read(path.join(__dirname, 'test_missing_disposable.js'));
    var missing = checker(src);
    test.ok(missing.length && missing[0] === 'goog.Disposable', 'goog.Disposable should be missing.');

    test.done();
  }

};
