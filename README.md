# grunt-iconizr

![iconizr](http://iconizr.com/iconizr.png)

> Takes a folder of SVG images and creates a CSS icon kit out of them, serving the icons as SVG / PNG sprite or embedded data URI (depending on the client's capabilities), along with suitable CSS / Sass / LESS etc. resources and a JavaScript loader for easy integration into your HTML documents. It wraps around the [iconizr](https://github.com/jkphl/node-iconizr) Node.js module which is built on top of [svg-sprite](https://github.com/jkphl/svg-sprite).


## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-iconizr --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-iconizr');
```

## The "iconizr" task

### Overview
In your project's Gruntfile, add a section named `iconizr` to the data object passed into `grunt.initConfig()`.

```javascript
grunt.initConfig({
  iconizr: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

Of course, the top level `options` object is optional and you may define as many targets as you want. Your targets should look like this:

```javascript
your_target: {
  src      : ['path/to/svg/dir'],
  dest     : 'path/to/css/dir'
}
```

As [iconizr](https://github.com/jkphl/node-iconizr) / [svg-sprite](https://github.com/jkphl/svg-sprite) accepts exactly one input directory, only the first element of the `src` resource list will be used. Alternatively, you may simply provide a single string as `src` argument: 

```javascript
your_target: {
  src      : 'path/to/svg/dir',
  dest     : 'path/to/css/dir'
}
```

### Options

You may provide both task and target specific `options`:

```javascript
your_target: {
  src       : 'path/to/svg/dir',
  dest      : 'path/to/css/dir',

  // Target specific options  
  options   : {
    dims    : true,
    keep    : true,
    preview : 'preview'
  }
}
```

The options are passed to [iconizr](https://github.com/jkphl/node-iconizr) /  as configuration values.

#### svg-sprite options

Options passed to *svg-sprite* are (please see the [svg-sprite reference](https://github.com/jkphl/svg-sprite#available-options) for details):

*	render
*	spritedir
*	sprite
*	prefix
*	common
*	maxwidth
*	maxheight
*	padding
*	pseudo
*	dims
*	keep
*	verbose
*	cleanwith
*	cleanconfig

#### iconizr options

Options passed to *iconizr* are (please see the [iconizr reference](https://github.com/jkphl/node-iconizr#available-options) for details):

*	quantize
*	level
*	embed
*	svg
*	png
*	preview

### Usage Examples

#### Basic example
In this very basic example, the default options are used to create an SVG sprite along with a suitable CSS file (the `render.css` option defaults to `TRUE`):

```javascript
grunt.initConfig({
  iconizr: {
    simple: {
      src: ['path/to/svg/dir'],
      dest: 'path/to/css/dir'
    }
  }
})
```

#### Sass / LESS example
In this slightly more verbose example, custom options are used to disable CSS output and create Sass / LESS resources instead (`render`). CSS rules specifying the image dimensions will be added (`dims`) and the optimized, intermediate SVG and PNG images used for creating the sprites won't be discarded (`keep`). Additionally, a set of HTML preview documents will be rendered (`preview`) which you can use for testing and previewing the icon kit. `verbose` prints some messages during the creation process.

```javascript
grunt.initConfig({
  svgsprite       : {
    spriteSass    : {
      src         : ['path/to/svg/dir'],
      dest        : 'path/to/css/dir',
      options     : {
        preview   : 'preview',
        dims      : dims,
        keep      : true,
        render    : {
          css     : false
          scss    : '../sass/_icons',
          less    : '../less/_icons'
        },
        verbose   : 1
      }
    }
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

#### v0.1.0
*	Initial release

##Legal
Copyright © 2014 Joschi Kuphal <joschi@kuphal.net> / [@jkphl](https://twitter.com/jkphl)

*grunt-iconizr* is licensed under the terms of the [MIT license](LICENSE.txt).

The contained example SVG icons are part of the [Tango Icon Library](http://tango.freedesktop.org/Tango_Icon_Library) and belong to the Public Domain.

