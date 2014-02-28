/*
 * grunt-iconizr
 * https://github.com/jkphl/grunt-iconizr
 *
 * Copyright (c) 2014 Joschi Kuphal
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
	var SVGSprite			= require('svg-sprite'),
	util					= require('util'),
	chalk					= require('chalk'),
	path					= require('path'),
	iconizr					= require(path.join('..', 'lib', 'iconizr.js'));
	
	grunt.registerMultiTask('iconizr', 'Grunt plugin that takes a folder of SVG icons and creates a CSS icon kit out of them, including SVG & PNG sprites, suitable CSS / Sass / LESS etc. resources and a JavaScript loader for easy integration into your HTML documents', function() {
		var options			= this.options(),
		that				= this;
		options._keep		= options.keep;
		options.keep		= 1;
		
		this.files.forEach(function(file) {
			var indir		= file.src.shift() || './',
			outdir			= util.isArray(file.dest) ? file.dest.shift() : ('' + file.dest),
			done			= that.async();
			
			grunt.log.writeln('Building SVG sprite from directory "%s" ...', indir);
			
			SVGSprite.createSprite(indir, outdir, options, function(error, results) {
				if (error) {
					console.error(error);
					done();
				} else {
					iconizr.createIconKit(results, done);
				}
			});
		});
	});
};
