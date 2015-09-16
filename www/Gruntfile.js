module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // Copy Over Files not Dealt With in Optimizer
        copy: {
            build: {
                files: [{
                    // htaccess file to prevent caching of index.html allowing our cacheBust to work
                    src: ['src/.htaccess'],
                    dest: 'build/.htaccess',
                    filter: 'isFile'
                }, {
                    // All Fonts, THis may be able to be removed
                    expand: true,
                    cwd: 'src/app/css/fonts',
                    src: ['**'],
                    dest: 'build/app/css/fonts'
                }, {
                    // Support Libraries for IE < 9
                    src: ['src/app/libs/es5-sham.min.js'],
                    dest: 'build/app/libs/es5-sham.min.js',
                    filter: 'isFile'
                }, {
                    // Support Libraries for IE < 9
                    src: ['src/app/libs/es5-shim.min.js'],
                    dest: 'build/app/libs/es5-shim.min.js',
                    filter: 'isFile'
                }, {
                    // Image Not Copied With Image Minifier
                    src: 'src/app/css/images/download-icon.svg',
                    dest: 'build/app/css/images/download-icon.svg',
                    filter: 'isFile'
                }, {
                    // CSS used to Support Ion Range Slider
                    src: ['src/app/libs/ion.rangeslider/css/normalize.min.css'],
                    dest: 'build/app/libs/ion.rangeslider/css/normalize.min.css',
                    filter: 'isFile'
                }, {
                    // CSS used to Support Ion Range Slider
                    src: ['src/app/libs/ion.rangeslider/css/ion.rangeSlider.skinNice.css'],
                    dest: 'build/app/libs/ion.rangeslider/css/ion.rangeSlider.skinNice.css',
                    filter: 'isFile'
                }, {
                    // CSS used to Support Ion Range Slider
                    src: ['src/app/libs/ion.rangeslider/css/ion.rangeSlider.css'],
                    dest: 'build/app/libs/ion.rangeslider/css/ion.rangeSlider.css',
                    filter: 'isFile'
                }, {
                    // Helper Libraries used at various points in the app
                    src: ['src/app/libs/FileSaver.js'],
                    dest: 'build/app/libs/FileSaver.js',
                    filter: 'isFile'
                }, {
                    // Helper Libraries used at various points in the app
                    src: ['src/app/libs/jquery-1.7.1.min.js'],
                    dest: 'build/app/libs/jquery-1.7.1.min.js',
                    filter: 'isFile'
                }, {
                    // Helper Libraries used at various points in the app
                    src: ['src/app/libs/jquery-2.1.1.min.js'],
                    dest: 'build/app/libs/jquery-2.1.1.min.js',
                    filter: 'isFile'
                }, {
                    // Helper Libraries used at various points in the app
                    src: ['src/app/libs/jquery-ui-custom.min.js'],
                    dest: 'build/app/libs/jquery-ui-custom.min.js',
                    filter: 'isFile'
                }, {
                    // Helper Libraries used at various points in the app
                    src: ['src/app/libs/jQAllRangeSliders-min.js'],
                    dest: 'build/app/libs/jQAllRangeSliders-min.js',
                    filter: 'isFile'
                }]
            }
        },

        // Copy over and minify index.html and
        htmlmin: {
            build: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    src: ['src/index.html'],
                    dest: 'build/index.html'
                }, {
                    src: ['src/report.html'],
                    dest: 'build/report.html'
                }, {
                    expand: true,
                    cwd: 'src/app',
                    src: ['**/*.html'],
                    dest: 'build/app'
                }]
            }
        },

        // Minify any JS left not copied over already
        uglify: {
            build: {
                options: {
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd/") %> */',
                    preserveComments: false
                },
                files: [{
                    dest: 'build/app/bootloader.js',
                    src: 'src/app/bootloader.js'
                }, {
                    dest: 'build/app/js/report/ReportLoader.js',
                    src: 'src/app/js/report/ReportLoader.js'
                }, {
                    dest: 'build/app/libs/html5shiv.js',
                    src: 'src/app/libs/html5shiv.js'
                }, {
                    dest: 'build/app/libs/ion.rangeslider/js/ion.rangeSlider.min.js',
                    src: 'src/app/libs/ion.rangeslider/js/ion.rangeSlider.min.js'
                }]
            }
        },

        imagemin: {
            build: {
                options: {
                    optimizationLevel: 7,
                    progressive: true
                },
                files: [{
                    expand: true,
                    cwd: 'src/app',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'build/app'
                }]
            }
        },

        ftp_push: {
            build: {
                options: {
                    host: 'staging.blueraster.com',
                    dest: 'html/wri/gfw-commodities/v42/',
                    authKey: 'staging'
                },
                files: [{
                    expand: true,
                    cwd: 'build',
                    src: ['**']
                }]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-ftp-push');

    grunt.registerTask('build', ['copy:build', 'htmlmin:build', 'uglify:build', 'imagemin:build']);

};
