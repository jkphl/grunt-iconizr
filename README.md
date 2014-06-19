grunt-iconizr
=============
<img src="http://iconizr.com/iconizr.png" alt="iconizr" align="right"/>
> Grunt plugin version

Takes a folder of SVG images and creates a CSS icon kit out of them. Depending on the client's capabilities, icons are served as SVG / PNG sprite or embedded data URIs. *iconizr* creates suitable CSS / Sass / LESS etc. resources and a JavaScript loader for easy integration into your HTML documents.

The *iconizr* Grunt plugin wraps around the [iconizr](https://github.com/jkphl/node-iconizr) and [svg-sprite](https://github.com/jkphl/svg-sprite) Node.js modules.


Getting Started
---------------
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-iconizr --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-iconizr');
```


The "iconizr" task
------------------

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
  src      : ['path/to/svg/image/dir'],  // Single input directory
  dest     : 'path/to/main/output/dir'   // Main output directory
}
```

As [iconizr](https://github.com/jkphl/node-iconizr) / [svg-sprite](https://github.com/jkphl/svg-sprite) accepts exactly **one input directory** for each run, only the first element of the `src` resource list will be used. That said, you may also provide a simple string as `src` argument: 

```javascript
your_target: {
  src      : 'path/to/svg/image/dir',    // Single input directory
  dest     : 'path/to/main/output/dir'   // Main output directory
}
```

### Processing workflow

Each time you create a CSS icon kit, these are the processing stages:

1.	[svg-sprite](https://github.com/jkphl/svg-sprite) will find all SVG files inside the input directory and **create an SVG sprite** out of them.
	*	The SVG images may be **automatically optimized** prior to being merged into the sprite, thus potentially saving some bytes.
	*	When used from within *iconizr*, no output files (except the SVG sprite itself) will be produced at this stage.
2.	[iconizr](https://github.com/jkphl/node-iconizr) creates **PNG fallbacks** and accompanying **stylesheet resources** around the SVG files.
	*	First, **PNG versions** of all SVG files will be created (including the SVG sprite).
	*	The PNG images may be **automatically optimized** by tools like `pngcrush`, `pngquant` and `optipng`.
	*	Depending on the configured output formats, *iconizr* creates **stylesheet resources in several flavours** (CSS, Sass, LESS etc.), each consisting of a set of files serving the icons in different ways (SVG or PNG, sprites or embedded data URIs).
	*	An **HTML loader fragment** is created that has to be included into your HTML documents. It will take care of loading the stylesheet variant that is most appropriate for each client.
	*	Optionally, a set of **preview HTML documents** is created that you can use for testing your icon kit. 

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

Each option will either be used by [svg-sprite](https://github.com/jkphl/svg-sprite) or [iconizr](https://github.com/jkphl/node-iconizr) (or both) for configuring their processing workflows. Please see the corresponding references for details. 

|Option       |Description  |Reference    |
|:------------|:------------|:-----------:|
|render       |Rendering configuration (output formats like CSS, Sass, LESS, HTML with inline SVG, etc.)|[svg-sprite](https://github.com/jkphl/svg-sprite#rendering-configuration)|
|variables    |Custom Mustache rendering variables [`{}`]|[svg-sprite](https://github.com/jkphl/svg-sprite#available-options)|
|spritedir    |Sprite subdirectory name [`"svg"`]|[svg-sprite](https://github.com/jkphl/svg-sprite#available-options)|
|sprite       |Sprite file name [`"sprite"`]|[svg-sprite](https://github.com/jkphl/svg-sprite#available-options)|
|prefix       |CSS selector prefix [`"svg"`]|[svg-sprite](https://github.com/jkphl/svg-sprite#available-options)|
|common       |Common CSS selector for all images [*empty*]|[svg-sprite](https://github.com/jkphl/svg-sprite#available-options)|
|maxwidth     |Maximum single image width [`1000`]|[svg-sprite](https://github.com/jkphl/svg-sprite#available-options)|
|maxheight    |Maximum single image height [`1000`]|[svg-sprite](https://github.com/jkphl/svg-sprite#available-options)|
|padding      |Transparent padding around the single images (in pixel) [`0`]|[svg-sprite](https://github.com/jkphl/svg-sprite#available-options)|
|layout       |Image arrangement within the sprite (`"vertical"`, `"horizontal"` or `"diagonal"`) [`"vertical"`]|[svg-sprite](https://github.com/jkphl/svg-sprite#available-options)|
|pseudo       |Character sequence for denoting CSS pseudo classes [`"~"`]|[svg-sprite](https://github.com/jkphl/svg-sprite#available-options)|
|dims         |Render image dimensions as separate CSS rules [`false`]|[svg-sprite](https://github.com/jkphl/svg-sprite#available-options)|
|keep         |Keep intermediate SVG files (inside the sprite subdirectory) [`false`]|[svg-sprite](https://github.com/jkphl/svg-sprite#available-options)|
|recursive    |Recursive scan of the input directory for SVG files [`false`]|[svg-sprite](https://github.com/jkphl/svg-sprite#available-options)|
|verbose      | Output verbose progress information (0-3) [`0`]|[svg-sprite](https://github.com/jkphl/svg-sprite#available-options)|
|cleanwith    |Module to be used for SVG cleaning. Currently "scour" or "svgo" [`"svgo"`]|[svg-sprite](https://github.com/jkphl/svg-sprite#available-options)|
|cleanconfig  |Configuration options for the cleaning module [`{}`]|[svg-sprite](https://github.com/jkphl/svg-sprite#available-options)|
|quantize     |Whether to quantize the PNG images (convert to 8-bit) [`false`]|[node-iconizr](https://github.com/jkphl/node-iconizr#available-options)|
|level        |PNG image optimization level (0-11) [`3`]|[node-iconizr](https://github.com/jkphl/node-iconizr#available-options)|
|embed        |Embed path for the HTML loader fragment [*empty*]|[node-iconizr](https://github.com/jkphl/node-iconizr#available-options)|
|svg          |Maximum data URI size for SVG embedding [`1048576`]|[node-iconizr](https://github.com/jkphl/node-iconizr#available-options)|
|png          |Maximum data URI size for PNG embedding [`32768`]|[node-iconizr](https://github.com/jkphl/node-iconizr#available-options)|
|preview      |Relative directory path used for preview document rendering [*empty*]|[node-iconizr](https://github.com/jkphl/node-iconizr#available-options)|

### Usage Examples

#### Basic example
In this very basic example, the default options are used to create **SVG and PNG sprites** along with suitable **CSS stylesheet resources** (the `render.css` option defaults to `TRUE`) and the **HTML loader fragment**:

```javascript
grunt.initConfig({
  iconizr: {
    simple: {
      src: ['path/to/svg/dir'],
      dest: 'path/to/css'
    }
  }
})
```

These files are created at `path/to`:

```bash
`-- css
    |-- icons
    |   |-- icons.png
    |   `-- icons.svg
    |-- sprite-loader-fragment.html
    |-- sprite-png-data.css
    |-- sprite-png-sprite.css
    |-- sprite-svg-data.css
    `-- sprite-svg-sprite.css
```

#### Sass / LESS example
In this slightly more verbose example, custom options are used to disable CSS output and create **Sass / LESS resources** instead (`render`). CSS rules specifying the **image dimensions** will be added (`dims`) and the optimized, **intermediate SVG and PNG images** used for creating the sprites won't be discarded (`keep`). Additionally, a set of **HTML preview documents** will be rendered (`preview`). `verbose` prints some messages during the creation process.

```javascript
grunt.initConfig({
  svgsprite       : {
    spriteSass    : {
      src         : ['path/to/svg/dir'],
      dest        : 'path/to/css',
      options     : {
        preview   : 'preview',
        dims      : true,
        keep      : true,
        render    : {
          css     : false,
          scss    : '../sass/_icons',
          less    : '../less/_icons'
        },
        verbose   : 1
      }
    }
  }
})
```

These files are created at `path/to` (when run with the example SVG images coming with *iconizr*):

```bash
|-- css
|   |-- icons
|   |   |-- icons.png
|   |   |-- icons.svg
|   |   |-- weather-clear-night.png
|   |   |-- weather-clear-night.svg
|   |   |-- weather-clear.png
|   |   |-- weather-clear.svg
|   |   |-- weather-few-clouds-night.png
|   |   |-- weather-few-clouds-night.svg
|   |   |-- weather-few-clouds.png
|   |   |-- weather-few-clouds.svg
|   |   |-- weather-overcast.png
|   |   |-- weather-overcast.svg
|   |   |-- weather-severe-alert.png
|   |   |-- weather-severe-alert.svg
|   |   |-- weather-showers-scattered.png
|   |   |-- weather-showers-scattered.svg
|   |   |-- weather-showers.png
|   |   |-- weather-showers.svg
|   |   |-- weather-snow.png
|   |   |-- weather-snow.svg
|   |   |-- weather-storm.png
|   |   |-- weather-storm.svg
|   |   |-- weather-storm~hover.png
|   |   |-- weather-storm~hover.svg
|   |   |-- weather-x-missing-dimensions.png
|   |   `-- weather-x-missing-dimensions.svg
|   |-- preview
|   |   |-- svg-png-data-preview.html
|   |   |-- svg-png-sprite-preview.html
|   |   |-- svg-preview.html
|   |   |-- svg-svg-data-preview.html
|   |   `-- svg-svg-sprite-preview.html
|   `-- svg-loader-fragment.html
|-- less
|   |-- _icons-png-data.less
|   |-- _icons-png-single.less
|   |-- _icons-png-sprite.less
|   |-- _icons-svg-data.less
|   |-- _icons-svg-single.less
|   `-- _icons-svg-sprite.less
`-- sass
    |-- _icons-png-data.scss
    |-- _icons-png-single.scss
    |-- _icons-png-sprite.scss
    |-- _icons-svg-data.scss
    |-- _icons-svg-single.scss
    `-- _icons-svg-sprite.scss
```

> Please note that — although the `keep` option has been specified — the `*-single.{scss|less}` stylesheets (respectively their CSS products) will never be used by the loader fragment. Compared to sprites or data URIs, serving single images to your clients must be considered the worst solution of all (HTTP request overhead). The `*-single*` file flavours are only contained for the sake of completeness.  

#### Custom output formats & inline SVG embedding

The output rendering of *grunt-iconizr* is based on [Mustache](http://mustache.github.io) templates, which enables **full customization of the generated results**. You can even introduce completely new output formats. For details please see the [svg-sprite documentation](https://github.com/jkphl/svg-sprite#custom-output-formats).

Also, you may use *grunt-iconizr* to create an **inline SVG sprite** that can be embedded directly into your HTML documents. Please see the [svg-sprite documentation](https://github.com/jkphl/svg-sprite#inline-embedding) for details.


Contributing
------------
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).


Other versions
--------------
Besides this Grunt plugin there are several different versions of *iconizr*:

*	The [Node.js module](https://github.com/jkphl/node-iconizr) underlying this Grunt plugin.
*	A [PHP command line](https://github.com/jkphl/iconizr) version (that in fact is the "original" one, but compared to the Node.js / Grunt branch it's a little outdated at the moment ...).
*	The **online service** at [iconizr.com](http://iconizr.com) that's based on the aforementioned PHP version (you can use it for creating CSS icon kits without the need of a local installation).
*	Finally, [Haithem Bel Haj](https://github.com/haithembelhaj) published a [Grunt plugin](https://github.com/haithembelhaj/grunt-iconizr-php) that's also based on the PHP version. I never tried this one myself, though.


Release History
---------------

#### v0.2.2
*	[Compatibility release](https://github.com/jkphl/node-iconizr#v022)
*	Added a Stylus output template ([*node-iconizr* #5](https://github.com/jkphl/node-iconizr/pull/5))
*	Added the `variables` config option ([#13](https://github.com/jkphl/grunt-iconizr/issues/13))

#### v0.2.0
*	[Compatibility release](https://github.com/jkphl/node-iconizr#v020)
*	Fixed bug with the SVG sprite not used by the Sass & LESS output types ([#6](https://github.com/jkphl/grunt-iconizr/issues/6)) 
*	Documentation corrections

#### v0.1.1
*	npm troubleshooting release

#### v0.1.0
*	Initial release


Legal
-----
Copyright © 2014 Joschi Kuphal <joschi@kuphal.net> / [@jkphl](https://twitter.com/jkphl)

*grunt-iconizr* is licensed under the terms of the [MIT license](LICENSE.txt).

The contained example SVG icons are part of the [Tango Icon Library](http://tango.freedesktop.org/Tango_Icon_Library) and belong to the Public Domain.

