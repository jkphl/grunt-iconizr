'use strict';

var grunt		= require('grunt'),
path			= require('path'),
file			= require('file');

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

/**
 * Recursively find all files in a particular directory
 * 
 * @param {String} dir		Directory
 * @return {Array}			Files
 */
function find(dir) {
	var genfiles			= [];
    file.walkSync(dir, function(dirPath, dirs, files) {
      files.forEach(function(file){
        genfiles.push(path.join(dirPath, file));
      });
    });
    return genfiles;
}

exports.iconizr = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {
    test.expect(1);
    test.equal(find(path.resolve(__dirname, '../tmp/default')).length, 7, 'should result in 7 generated files.');
    test.done();
  },
  custom_options: function(test) {
    test.expect(1);
    test.equal(find(path.resolve(__dirname, '../tmp/custom')).length, 51, 'should result in 51 generated files.');
    test.done();
  }
};
