module.exports = function(grunt) {
    "use strict";
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    // Time how long tasks take. Can help when optimizing build times
    // require("time-grunt")(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        // Project settings
        config: {
            // Configurable paths
            app: "src/documents",
            files: "src/files",
            out: "out",
            dist: "dist"
        },

        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            options: {
                sassDir: "<%= config.app %>/sass",
                cssDir: ["<%= config.app %>/styles","out/styles"],
                generatedImagesDir: ".tmp/images/generated",
                imagesDir: "<%= config.app %>/images",
                javascriptsDir: "<%= config.app %>/scripts",
                fontsDir: "<%= config.app %>/fonts",
               // importPath: "<%= config.app %>/bower_components",
                httpImagesPath: "/images",
                httpGeneratedImagesPath: "/images/generated",
                httpFontsPath: "/fonts",
                relativeAssets: false,
                assetCacheBuster: false,
                sourcemap: true
            },
            dist: {
                options: {
                    generatedImagesDir: "<%= config.dist %>/images/generated"
                }
            },
            server: {
                options: {
                    debugInfo: true
                }
            }
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {

            gruntfile: {
                files: ["Gruntfile.js"]
            },
            compass: {
                files: ["<%= config.app %>/sass/{,*/}*.{scss,sass}"],
                tasks: ["compass:server", "autoprefixer"]
            },
            livereload: {
                options: {
                    livereload: "<%= connect.options.livereload %>"
                },
                files: [
                    "<%= config.out %>/{,*/}*.html",
                    ".tmp/styles/{,*/}*.css",
                    "<%= config.app %>/sass/{,*/}*.scss",
                    "<%= config.out %>/scripts/{,*/}*.js",
                    "<%= config.files %>/images/{,*/}*"
                ]
            }

        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9777,
                livereload: 35728,
                // Change this to "0.0.0.0" to access the server from outside
                hostname: "localhost"
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        ".tmp",
                        "<%= config.out %>",
                        "<%= config.app %>"
                    ]
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        ".tmp",
                        "test",
                        "<%= config.app %>"
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: "<%= config.dist %>",
                    livereload: false
                }
            }
        },

        // Empties folders to start fresh

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        ".tmp",
                        "<%= config.dist %>/*",
                        "!<%= config.dist %>/.git*"
                    ]
                }]
            },
            sass: ["<%= config.app %>/styles","out/styles"]
        },

        // Run some tasks in parallel to speed up build process
        concurrent: {
            server: [
                "compass:server",
                "copy:styles"
            ],
            test: [
                "copy:styles"
            ],
            dist: [
                "compass"
               // "copy:styles",
                // "imagemin",
                //"svgmin"
            ]
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ["last 2 version","> 1%"],
                cascade: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: "<%= config.out %>/styles/",
                    src: "{,*/}*.css",
                    dest: "<%= config.out %>/styles/"
                }]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: "<%= config.app %>",
                    dest: "<%= config.dist %>",
                    src: [
                        "*.{ico,png,txt}",
                        ".htaccess",
                        "fonts/*.{eot,ttf,woff,svg}",
                        "images/{,*/}*.webp",
                        "images/{,*/}*.*",
                        "{,*/}*.htm",
                        "{,*/}*.html",
                        "fonts/{,*/}*.*",
                        // "bower_components/bootstrap/fonts/*.*"
                    ]
                }, {
                   // expand: true,
                   // cwd: "<%= config.app %>/bower_components/bootstrap/fonts",
                   // src: ["*.{eot,ttf,woff,svg}"],
                   // dest: "<%= config.dist %>/fonts",
                   // filter: "isFile"
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: "<%= config.app %>/styles",
                dest: ".tmp/styles/",
                src: "{,*/}*.css"
            }
        },


    });
    grunt.registerTask("serve", function(target) {
        if (target === "dist") {
            return grunt.task.run(["build", "connect:dist:keepalive"]);
        }

        grunt.task.run([
            "clean:sass",
            "concurrent:server",
            "autoprefixer",
            "connect:livereload",
            "watch"
        ]);
    });
    grunt.registerTask("build", [
        "clean:dist",
        "useminPrepare",
        "concurrent:dist",
        "autoprefixer",
        "concat",
        "cssmin",
        "uglify",
        "copy:dist",
        "rev",
        "usemin",
        "htmlmin"
    ]);
    // grunt.registerTask("default", ["browserSync", "watch"]);
    grunt.registerTask("default", ["serve"]);
    grunt.registerTask("buildcss", ["sass", "cssc", "cssmin"]);
};
