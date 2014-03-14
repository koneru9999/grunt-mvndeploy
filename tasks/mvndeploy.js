/*
 * grunt-mvndeploy
 *
 * Copyright (c) 2013 Venkaiah Chowdary Koneru
 * Licensed under the MIT license.
 */

"use strict";

var fs = require("fs");
var path = require("path");
var glob = require("glob");
var ZipWriter = require("moxie-zip").ZipWriter;

module.exports = function(grunt) {
  /**
   * Given an instance of Grunt, a property name, and a default value, attempt to
   * retrieve and return the property with the given name. If it does not exist,
   * the default value is returned.
   */
  var g = function(prop, defaultValue) {
    var value = grunt.config.get(prop);
    if(value) {
      return value;
    } else {
      return defaultValue;
    }
  };

	if (typeof String.endsWith !== 'function') {
		String.prototype.endsWith = function (suffix) {
			return this.indexOf(suffix, this.length - suffix.length) !== -1;
		};
	};
	
  // Read package.json
  var pkg = grunt.file.readJSON("package.json");

  /**
   * Store all variables in grunt.config.
   */
  grunt.registerTask("mvndeploy:preprocess", function() {
    grunt.config.set("maven.debug", g("mvndeploy.options.debug", false));
    grunt.config.set("maven.groupId", g("mvndeploy.package.groupId"));
    grunt.config.set("maven.artifactId", g("mvndeploy.package.artifactId", pkg.name));

    // Snapshot/Release dependant variables.
	if(pkg.version.endsWith("-SNAPSHOT")) {
		grunt.config.set("maven.repositoryUrl", g("mvndeploy.snapshot.url"));
		grunt.config.set("maven.repositoryId", g("mvndeploy.snapshot.id"));
		grunt.config.set("maven.uniqueVersion", g("mvndeploy.snapshot.uniqueVersion", true));
		grunt.config.set("maven.isSnapshot", true);
	} else {
		grunt.config.set("maven.repositoryUrl", g("mvndeploy.release.url"));
		grunt.config.set("maven.repositoryId", g("mvndeploy.release.id"));
		grunt.config.set("maven.isSnapshot", false);
	}
	grunt.config.set("maven.version", g("mvndeploy.package.version", pkg.version));

    // Finally, filename, which is dependant on the artifactId and version.
    grunt.config.set("maven.file", grunt.config.get("maven.artifactId") + "-" + grunt.config.get("maven.version") + ".war");
  });

  /**
   * Create a WAR of the selected sources.
   */
  grunt.registerTask("mvndeploy:package", function() {
    // Create a new Zip file
    var zip = new ZipWriter();

    // Add each source file
    //
    // options.sources is a list of globbing patterns.  Iterate over each
    // globbing pattern to retrieve a list of matched files; add each of those
    // files to the ZIP file.
    grunt.config.get("mvndeploy.package.sources").forEach(function(e, i, a) {
      glob.sync(e).forEach(function(f, j, b) {
        if(fs.statSync(f).isFile()) {
          zip.addFile(f, f);
        }
      });
    });

    // Write the zip file
    zip.saveAs(g("maven.file"), function() {
      grunt.verbose.writeln("Wrote " + g("maven.file"));
    });
  });

  /**
   * Deploy the appropriate WAR to the appropriate repository.  Appropriate.
   */
  grunt.registerTask("mvndeploy:deploy", function() {
    // Set up arguments
    var args = ["deploy:deploy-file", "-Dpackaging=war"];
    if(g("maven.debug")) args.push("--debug");
    if(g("maven.repositoryId")) args.push("-DrepositoryId=" + g("maven.repositoryId"));
    args.push("-Dfile=" + g("maven.file"));
    args.push("-DgroupId=" + g("maven.groupId"));
    args.push("-DartifactId=" + g("maven.artifactId"));
    args.push("-Dversion=" + g("maven.version"));
    args.push("-Durl=" + g("maven.repositoryUrl"));
    if(g("maven.isSnapshot")) args.push("-DuniqueVersion=" + g("maven.uniqueVersion"));
 
    grunt.verbose.writeln("Running: maven " + args.join(" "));

    var done = this.async();
    grunt.util.spawn({cmd: "mvn", args: args}, function(err, result, code) {
      if(err) {
        grunt.log.error().error("deploy failed.");
        grunt.verbose.write(result.stdout + "\n");
      } else {
        grunt.verbose.ok();
        grunt.verbose.write(result.stdout + "\n");
      }
      done(err);
    });
  });

  // Tasks
  grunt.registerTask("mvndeploy:publish", ["mvndeploy:preprocess", "mvndeploy:package", "mvndeploy:deploy"]);
};
