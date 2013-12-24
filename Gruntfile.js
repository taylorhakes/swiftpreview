module.exports = function (grunt) {
    grunt.initConfig({
		clean: {
			build: ["build"]
		},
        processhtml: {
            build: {
                options: {
                    process: true
                },
                files: {
                    'build/options.html': ['src/options.html']
                }
            }
        },
        cssmin: {
            build: {
                files: {
                    'build/css/bootstrap.min.css': ['src/css/bootstrap.min.css'],
                    'build/css/options.min.css': ['src/css/options.css']
                }
            }
        },
        uglify: {
            build: {
                files: {
                    'build/js/options.min.js': ['src/js/resources/jquery.js','src/js/resources/bootstrap.min.js','src/js/itz.publish.js','src/js/itz.extend.js','src/js/options.js'],
					'build/js/background.min.js': ['src/js/background.js']
                }
            }
        },
		chromeManifest: {
			build: {
				options: {
					buildnumber: false,
					background: {
						target: 'js/background.min.js'
					}
				},
				src: 'src',
				dest: 'build'
			}
		},
		copy: {
			build: {
				files: [
					// includes files within path
					{expand: true, cwd: 'src/img/', src: '*.png', dest: 'build/img/', filter: 'isFile', flatten: true}
				]
			}
		},
		jshint: {
			all: ['src/js/*.js'],
			options:  {
				jshintrc: true
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js'
			}
		}
    });

    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-chrome-manifest');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('default', ['clean','chromeManifest','processhtml', 'cssmin', 'uglify', 'copy']);
    grunt.registerTask('test', ['jshint','karma']);
}


