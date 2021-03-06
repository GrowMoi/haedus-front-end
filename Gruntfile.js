// Generated on 2015-09-12 using generator-ionic 0.7.3
'use strict';

var _ = require('lodash');
var path = require('path');
var cordovaCli = require('cordova');
var spawn = process.platform === 'win32' ? require('win-spawn') : require('child_process').spawn;
var promise = require('bluebird');
var fs = promise.promisifyAll(require('fs'));
var folderImgs = 'app/images/';
var folderSnds = 'app/sounds/';
var folderVds = 'app/videos/';
var extImages = {
  png: true,
  jpg: true,
  jpeg: true,
  gif: true,
  svg: false
};
var extSounds = {
  mp3: true
};
var extVideos = {
  mp4: true
};

//get paths files into a folder
function readDir(dirName, extFile) {
  return fs.readdirAsync(dirName).map(function (fileName) {
    var route = path.join(dirName, fileName);
    return fs.statAsync(route).then(function(stat) {
      return stat.isDirectory() ? readDir(route) : route;
    });
  }).reduce(function (arrayFiles, currentFile) {
    var isString = typeof(currentFile) === 'string',
        ext = isString ? path.extname(currentFile).split('.').pop() : null,
        matchExt = isString && extFile ? extFile[ext] : true;
    return matchExt ? arrayFiles.concat(currentFile) : arrayFiles;
  }, []);
}

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: require('./config/yeoman-config'),

    // Environment Variables for Angular App
    // This creates an Angular Module that can be injected via ENV
    // Add any desired constants to the ENV objects below.
    // https://github.com/diegonetto/generator-ionic/blob/master/docs/FAQ.md#how-do-i-add-constants
    ngconstant: require('./config/ngconstant-config'),

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep', 'newer:copy:app']
      },
      html: {
          files: ['<%= yeoman.app %>/*.html'],
          tasks: ['newer:copy:app']
      },
      jadengtemplatecache: {
        files: ['<%= yeoman.app %>/**/*.jade'],
        tasks: ['jadengtemplatecache','newer:copy:templates']
      },
      js: {
        files: ['<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js',
                '!<%= yeoman.app %>/<%= yeoman.scripts %>/templates.js'],
        tasks: ['newer:copy:app', 'newer:jshint:all']
      },
      compass: {
        files: ['<%= yeoman.app %>/<%= yeoman.styles %>/**/*.{scss,sass}'],
        tasks: ['compass:server', 'newer:clean:css', 'autoprefixer', 'newer:copy:tmp']
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['ngconstant:development', 'newer:copy:app']
      },
      images: {
        files: ['<%= yeoman.app %>/<%= yeoman.images %>/**/*.{png,jpg,jpeg,gif,webp,svg}'],
        tasks: ['newer:copy:images']
      }
    },

    jadengtemplatecache: require('./config/jade-config'),

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost'
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      },
      coverage: {
        options: {
          port: 9002,
          open: true,
          base: ['coverage']
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js',
        '!<%= yeoman.app %>/<%= yeoman.scripts %>/templates.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/unit/**/*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.temp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.temp',
      css: {
        files: [{
          dot: true,
          src: [
            '<%= yeoman.dist %>/styles'
          ]
        }]
      },
    },

    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>/<%= yeoman.styles %>/',
          src: '{,*/}*.css',
          dest: '<%= yeoman.dist %>/<%= yeoman.styles %>/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      },
      sass: {
        src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: require('./config/compass-config'),

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        staging: '.temp',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/**/*.html'],
      css: ['<%= yeoman.dist %>/<%= yeoman.styles %>/**/*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    cssmin: {
      options: {
        //root: '<%= yeoman.app %>',
        noRebase: true
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: require('./config/copy-config'),

    concurrent: require('./config/concurrent-config'),

    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/<%= yeoman.styles %>/main.css': [
    //         '.temp/<%= yeoman.styles %>/**/*.css',
    //         '<%= yeoman.app %>/<%= yeoman.styles %>/**/*.css'
    //       ]
    //     }
    //   }
    // },
    uglify: {
      options: {
        mangle: false
      }
      // dist: {
      //   files: {
      //     '<%= yeoman.dist %>/<%= yeoman.scripts %>/scripts.js': [
      //       '<%= yeoman.dist %>/<%= yeoman.scripts %>/scripts.js'
      //     ]
      //   }
      // }
    },
    // concat: {
    //   dist: {}
    // },

    // Test settings
    // These will override any config options in karma.conf.js if you create it.
    karma: {
      options: {
        browsers: ['PhantomJS'],
        basePath: '',
        frameworks: ['mocha', 'chai', 'sinon'],
        files: [
          '<%= yeoman.app %>/bower_components/angular/angular.js',
          '<%= yeoman.app %>/bower_components/angular-mocks/angular-mocks.js',
          '<%= yeoman.app %>/bower_components/angular-animate/angular-animate.js',
          '<%= yeoman.app %>/bower_components/angular-sanitize/angular-sanitize.js',
          '<%= yeoman.app %>/bower_components/angular-ui-router/release/angular-ui-router.js',
          '<%= yeoman.app %>/bower_components/ionic/release/js/ionic.js',
          '<%= yeoman.app %>/bower_components/ionic/release/js/ionic-angular.js',
          '<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js',
          '<%= yeoman.app %>/templates/**/*.html',
          '<%= yeoman.test %>/unit/**/*.js'
        ],
        autoWatch: false,
        reporters: ['dots', 'coverage'],
        port: 8080,
        singleRun: false,
        colors: true,
        phantomjsLauncher: {
          exitOnResourceError: true
        },
        preprocessors: {
          // Update this if you change the yeoman config path
          '<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js': ['coverage'],
          '<%= yeoman.app %>/templates/**/*.html': ['ng-html2js']
        },
        coverageReporter: {
          reporters: [
            { type: 'html', dir: 'coverage/' },
            { type: 'text-summary' }
          ]
        },
        ngHtml2JsPreprocessor: {
           moduleName: 'moi.templates',
           stripPrefix: '<%= yeoman.app %>/'
        }
      },
      unit: {
        // Change this to 'Chrome', 'Firefox', etc. Note that you will need
        // to install a karma launcher plugin for browsers other than Chrome.
        browsers: ['PhantomJS'],
        background: true
      },
      continuous: {
        browsers: ['PhantomJS'],
        singleRun: true
      }
    },

    // ngAnnotate tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>/concat/<%= yeoman.scripts %>',
          src: '*.js',
          dest: '<%= yeoman.dist %>/concat/<%= yeoman.scripts %>'
        }]
      }
    },

    // grunt-protractor-runner
    protractor: {
      options: {
        configFile: '<%= yeoman.test %>/e2e-tests.conf.js'
      },
      all: {}
    }

  });

  // Register tasks for all Cordova commands
  _.functions(cordovaCli).forEach(function (name) {
    grunt.registerTask(name, function () {
      this.args.unshift(name.replace('cordova:', ''));
      // Handle URL's being split up by Grunt because of `:` characters
      if (_.contains(this.args, 'http') || _.contains(this.args, 'https')) {
        this.args = this.args.slice(0, -2).concat(_.last(this.args, 2).join(':'));
      }
      var done = this.async();
      var exec = process.platform === 'win32' ? 'cordova.cmd' : 'cordova';
      var cmd = path.resolve('./node_modules/cordova/bin', exec);
      var flags = process.argv.splice(3);
      var child = spawn(cmd, this.args.concat(flags));
      child.stdout.on('data', function (data) {
        grunt.log.writeln(data);
      });
      child.stderr.on('data', function (data) {
        grunt.log.error(data);
      });
      child.on('close', function (code) {
        code = code ? false : true;
        done(code);
      });
    });
  });

  // Since Apache Ripple serves assets directly out of their respective platform
  // directories, we watch all registered files and then copy all un-built assets
  // over to <%= yeoman.dist %>/. Last step is running cordova prepare so we can refresh the ripple
  // browser tab to see the changes. Technically ripple runs `cordova prepare` on browser
  // refreshes, but at this time you would need to re-run the emulator to see changes.
  grunt.registerTask('ripple', ['wiredep', 'newer:copy:app', 'ripple-emulator']);
  grunt.registerTask('ripple-emulator', function () {
    grunt.config.set('watch', {
      all: {
        files: _.flatten(_.pluck(grunt.config.get('watch'), 'files')),
        tasks: ['newer:copy:app', 'prepare']
      }
    });

    var cmd = path.resolve('./node_modules/ripple-emulator/bin', 'ripple');
    var child = spawn(cmd, ['emulate']);
    child.stdout.on('data', function (data) {
      grunt.log.writeln(data);
    });
    child.stderr.on('data', function (data) {
      grunt.log.error(data);
    });
    process.on('exit', function (code) {
      child.kill('SIGINT');
      process.exit(code);
    });

    return grunt.task.run(['watch']);
  });

  grunt.registerTask('protractor:ci', [
    'protractor:ci:standalone'
  ]);

  grunt.registerTask('protractor:ci:standalone', function (){
    var done = this.async(),
        gruntLog = function (data) { grunt.log.writeln(data); },
        gruntErr = function (data) { grunt.log.error(data); };

    var express = spawn(
      'node',
      ['server.js']
    );
    express.stdout.on('data', gruntLog);
    express.stderr.on('data', gruntErr);

    var protractor = spawn(
      path.resolve('./node_modules/protractor/bin/', 'protractor'),
      ['test/e2e-tests.conf.js']
    );
    protractor.stdout.on('data', gruntLog);
    protractor.stderr.on('data', gruntErr);
    protractor.on('close', function (code) {
      express.kill();
      code = code ? false : true;
      done(code);
    });
  });

  grunt.registerTask('watch:specs', function () {
    var karma = {
      files: ['<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js', '<%= yeoman.test %>/unit/**/*.js'],
      tasks: ['newer:jshint:test', 'karma:unit:run']
    };
    var protractor = {
      files: ['<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js', '<%= yeoman.test %>/e2e/**/*.js'],
      tasks: ['newer:jshint:test', 'protractor:ci']
    };

    grunt.config.set('watch', [karma, protractor]);

    return grunt.task.run(['watch']);
  });

  // Wrap ionic-cli commands
  grunt.registerTask('ionic', function() {
    var done = this.async();
    var script = path.resolve('./node_modules/ionic/bin/', 'ionic');
    var flags = process.argv.splice(3);
    var child = spawn(script, this.args.concat(flags), { stdio: 'inherit' });
    child.on('close', function (code) {
      code = code ? false : true;
      done(code);
    });
  });

  grunt.registerTask('imagespath', function(environment){
    var done = this.async();
    readDir(folderImgs, extImages).then(function(imgs){
      grunt.config.set('ngconstant.'+ environment + '.constants.IMAGES.paths', imgs);
      grunt.task.run(['ngconstant:'+ environment]);
      done();
    });
  });

  grunt.registerTask('soundspath', function(environment){
    var done = this.async();
    readDir(folderSnds, extSounds).then(function(snds){
      grunt.config.set('ngconstant.'+ environment + '.constants.SOUNDS.paths', snds);
      grunt.task.run(['ngconstant:'+ environment]);
      done();
    });
  });

  grunt.registerTask('videospath', function(environment){
    var done = this.async();
    readDir(folderVds, extVideos).then(function(snds){
      grunt.config.set('ngconstant.'+ environment + '.constants.VIDEOS.paths', snds);
      grunt.task.run(['ngconstant:'+ environment]);
      done();
    });
  });

  grunt.registerTask('test', [
    'wiredep',
    'clean',
    'concurrent:test',
    'autoprefixer',
    'karma:unit:start',
    'watch:specs'
  ]);

  grunt.registerTask('test:ci', [
    'jshint:all',
    'wiredep',
    'clean',
    'concurrent:test',
    'ngconstant:test',
    'imagespath:test',
    'soundspath:test',
    'videospath:test',
    'autoprefixer',
    'karma:continuous'
  ]);

  grunt.registerTask('test:precommit', [
    'jshint:all',
    'jshint:test',
    'wiredep',
    'clean',
    'concurrent:test',
    'ngconstant:test',
    'imagespath:test',
    'soundspath:test',
    'videospath:test',
    'autoprefixer',
    'karma:continuous'
  ]);

  grunt.registerTask('serve', function (target) {
    if (target === 'compress') {
      return grunt.task.run(['compress', 'ionic:serve']);
    }

    grunt.config('concurrent.ionic.tasks', ['ionic:serve', 'watch']);
    grunt.task.run(['wiredep', 'init', 'concurrent:ionic']);
  });
  grunt.registerTask('emulate', function() {
    grunt.config('concurrent.ionic.tasks', ['ionic:emulate:' + this.args.join(), 'watch']);
    return grunt.task.run(['init', 'concurrent:ionic']);
  });
  grunt.registerTask('run', function() {
    grunt.config('concurrent.ionic.tasks', ['ionic:run:' + this.args.join(), 'watch']);
    return grunt.task.run(['init', 'concurrent:ionic']);
  });
  grunt.registerTask('build', function() {
    return grunt.task.run(['init', 'ionic:build:' + this.args.join()]);
  });

  grunt.registerTask('init', [
    'clean',
    'ngconstant:development',
    'imagespath:development',
    'soundspath:development',
    'videospath:development',
    'wiredep',
    'concurrent:server',
    'autoprefixer',
    'newer:copy:app',
    'newer:copy:tmp'
  ]);


  grunt.registerTask('compress', [
    'clean',
    'ngconstant:production',
    'imagespath:production',
    'soundspath:production',
    'videospath:production',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'cssmin',
    'uglify',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('coverage',
    ['karma:continuous',
    'connect:coverage:keepalive'
  ]);

  grunt.registerTask('default', [
    'wiredep',
    'newer:jshint',
    'karma:continuous',
    'compress'
  ]);
};
