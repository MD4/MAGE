module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js']
        },
        concat: {
            options: {
                separator: '\n\n'
            },
            dist: {
                src: ['src/**/*.js'],
                dest: 'dist/MAGE.js'
            }
        },
        uglify: {
            options: {
                compress: {
                    drop_console: true
                }
            },
            build: {
                files: {
                    'dist/MAGE.min.js': ['dist/MAGE.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', [
        'jshint',
        'concat',
        'uglify'
    ]);

};