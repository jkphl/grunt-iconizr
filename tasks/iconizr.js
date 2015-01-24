'use strict';

/**
 * grunt-iconizr is a Grunt plugin for creating SVG sprites
 *
 * @see https://github.com/jkphl/grunt-iconizr
 *
 * @author Joschi Kuphal <joschi@kuphal.net> (https://github.com/jkphl)
 * @copyright © 2015 Joschi Kuphal
 * @license MIT https://raw.github.com/jkphl/grunt-iconizr/master/LICENSE.txt
 */

module.exports = function(grunt) {
	var Iconizr				= require('iconizr'),
	path					= require('path'),
	pretty					= require('prettysize'),
	chalk					= require('chalk');

	grunt.registerMultiTask('iconizr', 'Takes a folder of SVG images and creates a CSS icon kit out of them, including SVG & PNG sprites, suitable CSS / Sass / LESS / Stylus etc. resources and a JavaScript loader for easy integration into your HTML documents', function() {
		var iconizr			= null,
		config				= null;
		
		// Iterate over all specified file groups.
		this.files.forEach(function(f) {
			config			= config || this.options({dest: path.resolve(f.orig.dest)});
			iconizr			= iconizr || new Iconizr(config);
			var cwd			= path.normalize(f.orig.cwd || ''),
			cwdAbs			= path.resolve(cwd || '.'),
			expand			= !!f.orig.expand;
			
			f.src.map(function(file) {
				file		= path.normalize(file);
				return path.resolve(cwdAbs, (expand && cwd.length && (file.indexOf(cwd + path.sep) === 0)) ? file.substr(cwd.length + path.sep.length) : file);
			}).filter(function(file) {
				if (!grunt.file.exists(file)) {
					grunt.log.warn('Source file "' + file + '" not found.');
					return false;
				} else {
					return true;
				}
			}).forEach(function(file){
				this.add(file, path.relative(cwd, file), grunt.file.read(file));
			}, iconizr);
		}, this);
		
		if (iconizr) {
			var done		= this.async();
			iconizr.compile(function(error, result) {
				console.log();
				if (error) {
					
				} else {
					for (var mode in result) {
						for (var resource in result[mode]) {
							var file		= result[mode][resource];
							if (grunt.file.write(file.path, file.contents)) {
								grunt.log.writeln(chalk.green('✔ ') + file.relative + chalk.gray(' (' + pretty(file.contents.length) + ')'));
							}
						}
					}
				}
				done();
			});
		}
	});
};
