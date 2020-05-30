

// grunt file

const grunt = require('grunt');
//const eslint= require('grunt-eslint');
require('load-grunt-tasks')(grunt);

module.exports = function (grunt){

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.JSON'),
        eslint:{

            target: ['**/*.js', '!node_modules/**/*.js']
        }
    });

    grunt.registerTask('default', ['eslint']);

};