/*
 * grunt-r4-closure-checker
 * https://github.com/eredo/r4-grunt-closure-checker
 *
 * Copyright (c) 2013 Eric Schneller (eric@schnellers.name)
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

    // Configuration to be run (and then tested).
    closureCheck: {
      default_options: {
        options: {
          printFix: true,
          ignore: ['goog.notExists.Blub']
        },
        src: ['test/sample/*.js']
      }
    },

    watch: {
      dev: {
        files: ['tasks/*.js'],
        tasks: ['closureCheck']
      },
      dev_test: {
        files: ['tasks/**/*.js', 'test/*.js'],
        tasks: ['nodeunit']
      }
    },
    //
    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['closureCheck', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
