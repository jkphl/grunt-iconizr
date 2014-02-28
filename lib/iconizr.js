/*
 * grunt-iconizr
 * https://github.com/jkphl/grunt-iconizr
 *
 * Copyright (c) 2014 Joschi Kuphal
 * Licensed under the MIT license.
 */

(function(exports){
	"use strict";

	var _			= require('underscore'),
	path			= require('path'),
	fs				= require('fs'),
	svg2png			= require('svg2png'),
	async			= require('async'),
	execFile		= require('child_process').execFile,
	pngcrush		= require('pngcrush-bin').path,
	pngquant		= require('pngquant-bin').path,
	optipng			= require('optipng-bin').path,
	defaultOptions	= {
		quantize	: false,
		level		: 3
	};
	 
	/**
	 * Create a CSS icon kit from pre-processed SVG icons
	 * 
	 * @param {Object} results			Pre-processing results
	 * @return {Object}
	 */
	function iconizr(results) {
		this._options				= _.extend(defaultOptions, results.options);
		this._options.quantize		= !!this._options.quantize;
		this._options.level			= Math.max(0, Math.min(11, Math.abs(parseInt(this._options.level, 10)))) - 1;
		this._options.optimize		= this._options.level > 0;
		this._options.speed			= this._options.optimize ? Math.round(10 - (9 * this._options.level / 10)) : 0;
		this._options.optimization	= this._options.optimize ? Math.round(this._options.level * 7 / 10) : 0;
		
		this.files					= results.files;
		this.data					= results.data;
		this._options.iconDir		= path.resolve(this._options.outputDir, this._options.spritedir);
		
		// Determine the sprite files
		this.sprite					= {
			svg						: path.resolve(this._options.outputDir, this.data.sprite),
			png						: path.join(this._options.iconDir, path.basename(this.data.sprite, '.svg') + '.png')
		};
		
		// Collect all single files
		this.icons					= {svg: [], png: []};
		for (var s = 0, icon; s < this.data.svg.length; ++s) {
			icon					= path.join(this._options.iconDir, this.data.svg[s].name);
			try {
				if (fs.statSync(icon + '.svg').isFile()) {
					this.icons.svg.push(icon + '.svg');
					this.icons.png.push(icon + '.png');
				}
			} catch(e) {}
		}
		
//		console.log(this.icons);
//		console.log(JSON.stringify(this._options, null, 4));
	}
	
	/**
	 * Create an the icon kit
	 * 
	 * @param {Function} callback		Callback
	 * @return {void}
	 */
	iconizr.prototype.createIconKit = function(callback) {
		var that				= this;
		async.waterfall([
			
			// Convert all SVG files to PNG versions
		    function(_callback){
		    	that._svg2png(_callback);
		    },
		    
		    // Optimize the PNG images
		    function(_callback){
		    	if (that._options.optimize) {
		    		that._optimizePngs(_callback);
		    	} else {
		    		_callback(null);	
		    	}
		    }
		    
		], callback);
	}
	
	/**
	 * Create PNG versions of all involved SVG files
	 * 
	 * @param {Function} callback		Callback
	 * @return {void}
	 */
	iconizr.prototype._svg2png = function(callback) {
		var that					= this,
		tasks						= [function(_callback) {
			if (that._options.verbose > 2) {
				console.log('Building PNG sprite from "%s" ...', that.sprite.svg);
			}
			svg2png(that.sprite.svg, that.sprite.png, function(err) {
    			_callback(err);
			});
		}];
		for (var s = 0; s < this.icons.svg.length; ++s) {
			tasks.push(function(svg, png) { return function(_callback) {
				if (that._options.verbose > 2) {
					console.log('Building PNG icon from "%s" ...', svg);
				}
				svg2png(svg, png, function(err) {
        			_callback(err);
				});
			}}(this.icons.svg[s], this.icons.png[s]));
		}
		if (this._options.verbose < 2) {
			console.log('Building PNG versions %s SVG icon(s) ...', tasks.length);	
		}
		async.parallel(tasks, function(err) { callback(err); });
	}
	
	/**
	 * Optimize all PNG icons
	 * 
	 * @param {Function} callback		Callback
	 * @return {void}
	 */
	iconizr.prototype._optimizePngs = function(callback) {
		var that					= this,
		tasks						= [function(_callback) {
			if (that._options.verbose > 2) {
				console.log('Optimizing PNG sprite "%s" ...', that.sprite.png);
			}
			that._optimizePng(that.sprite.png, _callback);
		}];
		for (var s = 0; s < this.icons.svg.length; ++s) {
			tasks.push(function(png) { return function(_callback) {
				if (that._options.verbose > 2) {
					console.log('Optimizing PNG icon "%s" ...', png);
				}
				that._optimizePng(png, _callback);
			}}(this.icons.png[s]));
		}
		if (this._options.verbose < 2) {
			console.log('Optimizing %s PNG icon(s) ...', tasks.length);	
		}
		async.parallel(tasks, callback);
	}
	
	/**
	 * Optimize a single PNG icon
	 * 
	 * @param {String} png				PNG Icon
	 * @param {Function} callback		Callback
	 * @return {void}
	 */
	iconizr.prototype._optimizePng = function(png, callback) {
		var that					= this,
		remove						= [];
		
		async.waterfall([
			
			// Optimize with pngcrush
		    function(_callback){
		    	var args			= ['-reduce', '-brute', '-e', '-pc.png'];
		    	if (that._options.verbose < 2) {
					args.push('-q');	
				}
				args.push(png);
		    	execFile(pngcrush, args, function(error) {
		    		if (error) {
		    			_callback(error);	
		    		} else {
		    			remove.push(png);
		    			_callback(null, path.join(that._options.iconDir, path.basename(png, '.png') + '-pc.png'));
		    		}
				});
		    },
		    
		    // Optimize with pngquant
		    function(png, _callback){
			    if (that._options.quantize) {
		    		var args			= ['--speed', that._options.speed, '--force', '--transbug', '--ext', '-pq.png'];
			    	if (that._options.verbose >= 2) {
						args.push('--verbose');	
					}
					args.push(png);
			    	execFile(pngquant, args, function(error) {
			    		if (error) {
			    			_callback(error);	
			    		} else {
			    			var opt		= path.join(that._options.iconDir, path.basename(png, '.png') + '-pq.png');
			    			if (that._isSmallerThan(opt, png)) {
			    				remove.push(png);
			    				_callback(null, opt);
			    			} else {
			    				remove.push(opt);
			    				_callback(null, png);
			    			}
			    		}			
					});
		    	} else {
		    		_callback(null, png);	
		    	}
		    },
		    
		    // Optimize with optipng
		    function(png, _callback) {
		    	var opt				= path.join(that._options.iconDir, path.basename(png, '.png') + '-op.png'),
		    	args				= ['-o' + that._options.optimization, '-zm1-9', '-force', '-strip', 'all'];
		    	if (that._options.verbose < 2) {
					args.push('-quiet');	
				}
				args.push(opt);
				fs.writeFileSync(opt, fs.readFileSync(png));
				execFile(optipng, args, function(error, stdout, stderr) {
					if (error) {
						callback(error, png);
					} else {
						if (that._isSmallerThan(opt, png)) {
		    				remove.push(png);
		    				_callback(null, opt);
		    			} else {
		    				remove.push(opt);
		    				_callback(null, png);
		    			}
					}
				});
		    }
		    
		], function(error, opt) {
			if (error) {
				callback(error);
				return;
			}
			
			// Remove all redundant files
			for (var r = 0; r < remove.length; ++r) {
				fs.unlinkSync(remove[r]);
			}
			
			// Rename the optimized PNG to the original filename
			if (png != opt) {
				fs.renameSync(opt, png);
			}

			callback(null, png);
		});
	}
	
	/**
	 * Check if a file is smaller than another
	 * 
	 * @param {String} file1			File 1
	 * @param {String} file2			File 2
	 * @return {Boolean}
	 */
	iconizr.prototype._isSmallerThan = function(file1, file2) {
		try {
			return fs.statSync(file1).size < fs.statSync(file2).size;
		} catch(e) {
			return false;	
		}
	}
	
	/**
	 * Create a CSS icon kit from pre-processed SVG icons
	 * 
	 * @param {Object} results			Pre-processing results
	 * @param {Function} callback		Callback
	 * @return {Object}
	 */
	exports.createIconKit = function(results, callback) {
		new iconizr(results).createIconKit(callback);

//		for (var file in results.files) {
//			grunt.log.writeln(chalk.green('✔ ') + file + chalk.gray(' (' + results.files[file] + ' bytes)'));
//		}
	}

}(typeof exports === 'object' && exports || this));