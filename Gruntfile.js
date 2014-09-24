module.exports = function (grunt) {
	'use strict';

  /*
    This build file uses requirejs optimizer but cannot optimize into a single file due to the application
    using an external report feature.  It loads a new bootloader which pulls each file it needs, to handle that
    the app minifies the whole application into a single file but also keeps the report folder structure intact,
    it also has two css files, one for the whole app(app.css) which contains all the .styl files code except for 
    report.styl, report.styl maps to report.css, the js in the report folder is minified after being copied over
  */

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

    copy: {
      build: {
        files: [
          { expand: true, cwd: 'src/app/css/fonts', src: ['**'], dest: 'build/app/css/fonts' },
          { src: ['src/app/libs/es5-sham.min.js'], dest: 'build/app/libs/es5-sham.min.js', filter: 'isFile' },
          { src: ['src/app/libs/es5-shim.min.js'], dest: 'build/app/libs/es5-shim.min.js', filter: 'isFile' },
          { src: ['src/app/libs/html5shiv.js'], dest: 'build/app/libs/html5shiv.js', filter: 'isFile' },
          { src: ['src/.htaccess'], dest: 'build/.htaccess', filter: 'isFile' }
        ]
      }
    },

    htmlmin: {
      build: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [
          { src:['src/index.html'], dest: 'build/index.html'},
          { expand: true, cwd: 'src/app', src: ['**/*.html'], dest: 'build/app' }
        ]
      }
    },

    uglify: {
      build: {
        options: {
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd/") %> */',
          preserveComments: false
        },
        files: [
          { dest: 'build/app/bootloader.js', src: 'src/app/bootloader.js' },
          { expand: true, cwd: 'src/app/js/report/', dest:'build/app/js/report/', src: '**/*.js' }
        ]
      }
    },

    imagemin: {
      build: {
        options: {
          optimizationLevel: 7,
          progressive: true
        },
        files: [
          { expand: true, cwd: 'src/app', src: ['**/*.{png,jpg,gif}'], dest: 'build/app' }
        ]
      }
    },

    stylus: {
      develop: {
        options: {
          compress: false,
          linenos: true
        },
        files: {
          'src/app/css/app.css': ['src/app/css/**/*.styl','!src/app/css/report.styl'],
          'src/app/css/report.css': ['src/app/css/report.styl']
        }
      },
      build: {
        files: {
          'build/app/css/app.css': ['src/app/css/**/*.styl', '!build/app/css/report.styl'],
          'build/app/css/report.css': ['src/app/css/report.styl']
        }
      }
    },

    requirejs: {
      build: {
         options: {
          baseUrl: 'src',
          paths: {
            'dojo': 'empty:',
            'dijit': 'empty:',
            'dojox': 'empty:',
            'esri': 'empty:',
            'libs': 'app/libs',
            'map': 'app/js/map',
            'main': 'app/js/main',
            'utils': 'app/js/utils',
            'report':  'app/js/report',
            'analysis': 'app/js/analysis',
            'templates': 'app/templates',
            'controllers': 'app/js/controllers',
            'components': 'app/js/components',
            // Aliases
            'knockout': 'app/libs/knockout-3.1.0/index',
            'react': 'app/libs/react-0.11.1.min/index'
          },
          name: 'build/requireConfig',
          out: 'build/app/js/app.min.js'
        }
      }
    },

    ftp_push: {
      build: {
        options: {
          host: 'staging.blueraster.com',
          dest: 'html/wri/gfw-commodities/v4/',
          authKey: 'staging'
        },
        files: [
          { expand: true, cwd: 'build', src: ['**'] }
        ]
      }
    },

    watch: {
      stylus: {
        options: {
          debounceDelay: 250,
          spawn: false
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
  grunt.registerTask('build', ['copy:build','htmlmin:build','uglify:build','imagemin:build','stylus:build','requirejs:build', 'ftp_push:build']);
  grunt.registerTask('minify', ['copy:build','htmlmin:build','uglify:build','imagemin:build','stylus:build','requirejs:build']);

};