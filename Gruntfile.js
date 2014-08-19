module.exports = function (grunt) {
	'use strict';

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

    copy: {
      build: {
        files: [
          { expand: true, cwd: 'src/app/css/fonts', src: '**', dest: 'build/app/css/fonts' },
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
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd/") %> */'
        },
        files: {
          'build/app/bootloader.js': 'src/app/bootloader.js'
        }
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
          'src/app/css/app.css': ['src/app/css/**/*.styl']
        }
      },
      build: {
        files: {
          'build/app/css/app.css': ['src/app/css/**/*.styl']
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
          dest: 'html/wri/potico2/v1/',
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

  // on watch events, configure stylus to compile only changed files
  // grunt.event.on('watch', function (action, filepath) {
  //   grunt.config('stylus.develop.files.src', filepath);
  // });

  grunt.registerTask('develop', ['watch:stylus']);
  grunt.registerTask('build', ['copy:build','htmlmin:build','uglify:build','imagemin:build','stylus:build','requirejs:build', 'ftp_push:build']);
  grunt.registerTask('minify', ['copy:build','htmlmin:build','uglify:build','imagemin:build','stylus:build','requirejs:build']);

};