module.exports = function (grunt) {
	'use strict';

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),


    stylus: {
      develop: {
        options: {
          compress: false,
          linenos: true
        },
        files: {
          'src/app/css/app.css': ['src/app/css/**/*.styl']
        }
      },
      build: {
        files: {
          'build/app/css/app.css': ['src/app/css/**/*.styl']
        }
      }
    },

    watch: {
      stylus: {
        options: {
          debounceDelay: 250
        },
        files: ['src/app/css/**/*.styl'],
        tasks: ['stylus:develop']
      }
    }

	});

	grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-ftp-push');

  grunt.registerTask('develop', ['watch:stylus']);
  grunt.registerTask('build', []);
  grunt.registerTask('minify', []);

};