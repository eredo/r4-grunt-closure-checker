# grunt-r4-closure-checker

> Plugin which checks for classes in your source code and alerts when goog.require calls for certain packages are missing.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-r4-closure-checker --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-r4-closure-checker');
```

## The "r4_closure_checker" task

### Overview
In your project's Gruntfile, add a section named `r4_closure_checker` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  closureChecker: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
      src: []
    },
  },
})
```

### Options

#### options.printFix
Type: `Boolean`
Default value: `false`

When dependencies are missing within the code the task returns the javascript which is missing.

#### options.ignore
Type: `Array.<String>`
Default value: `[]`

Packages that should not throw an error when missing.

### Usage Examples

#### Default Options

```js
grunt.initConfig({
  closureChecker: {
    options: {},
    src: ['lib/**/*.js']
  }
})
```

#### Custom Options
In this example, custom options are used to do something else with whatever else.

```js
grunt.initConfig({
  closureChecker: {
    options: {
      printFix: true
    },
    src: ['lib/**/*.js']
  },
})
```

## Release History
0.1.0 -  2013-05-09

## Roadmap
0.2.0 -  Add an option to print the hole require stack for a file
0.5.0 -  Add an option to correct the require stack automaticaly
