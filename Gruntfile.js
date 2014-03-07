/*
 * grunt-iconizr
 * https://github.com/jkphl/grunt-iconizr
 *
 * Copyright (c) 2014 Joschi Kuphal
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    iconizr: {
      default_options: {
        src : ['test/fixtures'],
        dest : ['tmp/default/css'],
        options: {
          verbose: 1
        }
      },
      custom_options: {
        src : 'test/fixtures',
        dest : ['tmp/custom/css'],
        options : {
          preview : 'preview',
          keep : true,
          render : {
            scss : '../sass/_icons',
            less : '../less/_icons'
          },
          verbose: 1
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'iconizr', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
