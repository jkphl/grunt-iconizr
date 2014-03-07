/*
 * grunt-iconizr
 * https://github.com/jkphl/grunt-iconizr
 *
 * Copyright (c) 2014 Joschi Kuphal
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
	var Iconizr				= require('iconizr'),
	util					= require('util'),
	chalk					= require('chalk'),
	path					= require('path');
	
	grunt.registerMultiTask('iconizr', 'Grunt plugin that takes a folder of SVG icons and creates a CSS icon kit out of them, including SVG & PNG sprites, suitable CSS / Sass / LESS etc. resources and a JavaScript loader for easy integration into your HTML documents', function() {
		var options			= this.options(),
		that				= this;
		
		this.files.forEach(function(file) {
			var inputDir	= file.src.shift() || './',
			outputDir		= util.isArray(file.dest) ? file.dest.shift() : ('' + file.dest),
			done			= that.async();
			
			Iconizr.createIconKit(inputDir, outputDir, options, function(error, results) {
				if (error) {
					console.error(error);
				}
				done();
			});
		});
	});
};
