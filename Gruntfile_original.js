module.exports = function(grunt) {
    "use strict";
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    // Time how long tasks take. Can help when optimizing build times
    require("time-grunt")(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        // Project settings
        config: {
            // Configurable paths
            app: "app",
            dist: "dist"
        },


        sass: { // Task
            dist: { // Target
                options: { // Target options
                    style: 'expanded',
                    sourcemap: true,
                    debugInfo: true
                },
                files: { // Dictionary of files
                    '.tmp/styles': '<%= config.app %>/styles/{,*/}*.scss', // 'destination': 'source'
                }
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            options: {
                sassDir: "<%= config.app %>/styles",
                cssDir: ".tmp/styles",
                generatedImagesDir: ".tmp/images/generated",
                imagesDir: "<%= config.app %>/images",
                javascriptsDir: "<%= config.app %>/scripts",
                fontsDir: "<%= config.app %>/fonts",
                importPath: "<%= config.app %>/bower_components",
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
            bower: {
                files: ["bower.json"],
                tasks: ["bowerInstall"]
            },
            js: {
                files: ["<%= config.app %>/scripts/{,*/}*.js"],
                tasks: ["jshint"],
                options: {
                    livereload: true
                }
            },
            html: {
                files: ["<%= config.app %>/{,*/}*.html", "<%= config.app %>/{,*/}*.htm"],
                tasks: ["htmlhint"],
                options: {
                    livereload: true
                }
            },
            jstest: {
                files: ["test/spec/{,*/}*.js"],
                tasks: ["test:watch"]
            },
            gruntfile: {
                files: ["Gruntfile.js"]
            },
            // sass: {
            //     files: ["<%= config.app %>/styles/{,*/}*.{scss,sass}"],
            //     tasks: ["compass:server", "autoprefixer"]
            // },
            compass: {
                files: ["<%= config.app %>/styles/{,*/}*.{scss,sass}"],
                tasks: ["compass:server", "autoprefixer"]
            },
            styles: {
                files: ["<%= config.app %>/styles/{,*/}*.css"],
                tasks: ["newer:copy:styles", "autoprefixer"]
            },
            livereload: {
                options: {
                    livereload: "<%= connect.options.livereload %>"
                },
                files: [
                    "<%= config.app %>/{,*/}*.htm",
                    "<%= config.app %>/{,*/}*.html",
                    ".tmp/styles/{,*/}*.css",
                    "<%= config.app %>/styles/{,*/}*.scss",
                    "<%= config.app %>/images/{,*/}*"
                ]
            }
        },
        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // Change this to "0.0.0.0" to access the server from outside
                hostname: "localhost"
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        ".tmp",
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
            server: ".tmp"
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
                "compass",
                "copy:styles",
                // "imagemin",
                "svgmin"
            ]
        },
        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ["last 2 version","> 1%","Firefox ESR","Opera 12.1"],
                cascade: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: ".tmp/styles/",
                    src: "{,*/}*.css",
                    dest: ".tmp/styles/"
                }]
            }
        },
        // remove unused CSS
        uncss: {
            dist: {
                options: {
                    ignore: [".affix", /affix/],
                    stylesheets: ["css/bootstrap.min.css", "css/master.css"],
                    timeout: 1000,
                    report: "gzip"
                },
                files: {
                    "css/tidy.css": ["index.htm"]
                }
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
                    expand: true,
                    cwd: "<%= config.app %>/bower_components/bootstrap/fonts",
                    src: ["*.{eot,ttf,woff,svg}"],
                    dest: "<%= config.dist %>/fonts",
                    filter: "isFile"
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
        // Automatically inject Bower components into the HTML file
        bowerInstall: {
            app: {
                src: ["<%= config.app %>/*.html"],
                ignorePath: "<%= config.app %>/",
                exclude: ["<%= config.app %>/bower_components/bootstrap-sass/vendor/assets/javascripts/bootstrap.js"]
            },
            sass: {
                src: ["<%= config.app %>/styles/{,*/}*.{scss,sass}"],
                ignorePath: "<%= config.app %>/bower_components/"
            }
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        "<%= config.dist %>/scripts/{,*/}*.js",
                        "<%= config.dist %>/styles/{,*/}*.css",
                        "<%= config.dist %>/images/{,*/}*.*",
                        // "<%= config.dist %>/styles/fonts/{,*/}*.*",
                        "<%= config.dist %>/*.{ico,png,jpg,jpeg}"
                    ]
                }
            }
        },
        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            options: {
                dest: "<%= config.dist %>"
            },
            html: "<%= config.app %>/*.html"
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            options: {
                assetsDirs: ["<%= config.dist %>", "<%= config.dist %>/images"]
            },
            html: ["<%= config.dist %>/{,*/}*.html"],
            css: ["<%= config.dist %>/styles/{,*/}*.css"]
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: "<%= config.app %>/images",
                    src: "{,*/}*.{gif,jpeg,jpg,png}",
                    dest: "<%= config.dist %>/images"
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: "<%= config.app %>/images",
                    src: "{,*/}*.svg",
                    dest: "<%= config.dist %>/images"
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true
                },
                files: [{
                    expand: true,
                    cwd: "<%= config.dist %>",
                    src: "{,*/}*.html",
                    dest: "<%= config.dist %>"
                }]
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: ".jshintrc",
                reporter: require("jshint-stylish")
            },
            all: [
                "Gruntfile.js",
                "<%= config.app %>/scripts/{,*/}*.js",
                "!<%= config.app %>/scripts/vendor/*",
                "test/spec/{,*/}*.js"
            ]
        },
        htmlhint: {
            build: {
                options: {
                    "tag-pair": true,
                    // Force tags to have a closing pair
                    "tagname-lowercase": false,
                    // Force tags to be lowercase
                    "attr-lowercase": false,
                    // Force attribute names to be lowercase e.g. <div id="header"> is invalid
                    "attr-value-double-quotes": true,
                    // Force attributes to have double quotes rather than single
                    "doctype-first": true,
                    // Force the DOCTYPE declaration to come first in the document
                    "spec-char-escape": true,
                    // Force special characters to be escaped
                    "id-unique": true,
                    // Prevent using the same ID multiple times in a document
                    "head-script-disabled": false,
                    // Prevent script tags being loaded in the  for performance reasons
                    "style-disabled": false
                    // Prevent style tags. CSS should be loaded through
                },
                src: ["<%= config.app %>/{,*/}*.html", "<%= config.app %>/{,*/}*.htm"]
            }
        },

        // uglify: {
        //     build: {
        //         files: {
        //             "build/js/**/*.min.js": ["assets/js/**/*.js"]
        //         }
        //     }
        // },
        // browserSync: {
        //     dev: {
        //         bsFiles: {
        //             src: [
        //                 "css/**/*.css",
        //                 "*.htm",
        //                 "*.html",
        //                 "app/**/*.html",
        //                 "app/**/*.htm",
        //                 "snippets/**/*.htm",
        //                 "**/**/*.php",
        //                 "js/**/*.js",
        //                 "img/**/*.jpg",
        //                 "img/**/*.jpeg",
        //                 "img/**/*.png",
        //                 "img/**/*.gif"
        //             ]
        //         },
        //         options: {
        //             host: "192.168.3.155",
        //             debugInfo: true,
        //             ghostMode: {
        //                 clicks: true,
        //                 scroll: true,
        //                 links: true,
        //                 forms: true
        //             },
        //             injectChanges: true,
        //             excludedFileTypes: ["ozz"],
        //             watchTask: true
        //         }
        //     }
        // }


    });
    grunt.registerTask("serve", function(target) {
        if (target === "dist") {
            return grunt.task.run(["build", "connect:dist:keepalive"]);
        }

        grunt.task.run([
            "bowerInstall",
            "clean:server",
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
