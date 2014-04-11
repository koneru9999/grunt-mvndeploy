grunt-mvndeploy
===============

Deploy node projects to Maven repositories.

Inspired from grunt-mvndeploy module but added additional fucntionality to automatically publish to SNAPSHOT repo based on the version.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out
the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains
how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as
install and use Grunt plugins. Once you're familiar with that process, you may
install this plugin with this command:

```shell
npm install grunt-mvndeploy --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile
with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-mvndeploy');
```

## The "mvn-deploy" task

### Overview

In your project's Gruntfile, add a section named `mvn-deploy` to the data
object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  mvn-deploy: {
    options: {
      debug: true // Optional boolean
    },
    "package": {
      groupId: "com.example",
      artifactId: "project",
      sources: ["dist/**"],
      version: "6.6.6"
    },
    snapshot: {
      url: "http://maven.example.com/snapshots",
      id: "example-snaps"
    },
    release: {
      url: "http://maven.example.com/releases",
      id: "example-releases"
    }
  }
})
```

### Options

#### options.debug
Type: `Boolean`  
Default: false

Whether or not the `--debug` flag should be passed to maven.

#### package.groupId
Type: `String`  
Required

Maven `groupId`, e.g. `com.yourcompany`.


#### package.artifactId
Type: `String`  
Default: `name` field in `package.json`

Name of artifact to publish.  This field will default to the `name` field in `package.json`.

#### package.sources
Type: `Array`  
Required

A list of glob-compatible paths to include in the package.

#### package.version
Type: `String`   
Default: `version` field in `package.json`

The version of the artifact to publish.  This field will default to the `version` field in `package.json`.

#### snapshot.url
Type: `String`   
Required

URL to your snapshots repository

#### snapshot.id
Type: `String`   
Optional

The `id` of the snapshot repository if it is defined in your `settings.xml` file.  This option is useful if your repository requires authentication.

### snapshot.uniqueVersion
Type: `Boolean`  
Default: true

Whether to deploy snapshots with a unique version or not.

#### release.url
Type: `String`   
Required

URL to your snapshots repository

#### release.id
Type: `String`   
Optional

The `id` of the snapshot repository if it is defined in your `settings.xml` file.  This option is useful if your repository requires authentication.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding
style. Add unit tests for any new or changed functionality. Lint and test your
code using [Grunt](http://gruntjs.com/).

## Release History

### 1.0.5

Fix README.md docuemntation error and change the module name

### 1.0.4

Update to git and update package.json for git url's

### 1.0.3

Added unique version capability for snapshots.

### 1.0.2

Initial release.
