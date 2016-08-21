module.exports = function(grunt){

	grunt.initConfig({	
		//pkg: grunt.file.readJSON('package.json'),

		watch: {
			jade: {
				files: ['views/**'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
				options: {
					livereload: true
				}
			}	

		},
		nodemon: {
			dev: {
				options: {
					file: 'app.js',
					args: [],
					ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store' , '.git', '*.bk'],
					watchedExtensions: ['js'],
					watchedFolders: ['./'],
					debug: true,
					delayTime: 1,
					env: {
						PORT: 3000
					},
					cwd: __dirname
				}
			}

		},
		mochaTest: {
      		test: {
        		options: {
          		reporter: 'spec',
          		captureFile: 'results.txt', // Optionally capture the reporter output to a file
          		quiet: false, // Optionally suppress output to standard out (defaults to false)
          		clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
        		},
        		src: ['test/**/*.js']
      		}
    	},
		concurrent: {
			tasks: ['nodemon', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-mocha-test');
	//grunt.loadNpmTasks('grunt-contrib-less')
  	//grunt.loadNpmTasks('grunt-contrib-uglify')
  	//grunt.loadNpmTasks('grunt-contrib-jshint')	

	grunt.option('force',true);

	grunt.registerTask('default',['concurrent']);

	grunt.registerTask('test', ['mochaTest'])

};