# monoBitmapFontCreator
Simple ASCII (printable characters only) monospace bitmap/raster font web tool compatible with [fbg](https://github.com/grz0zrg/fbg) library

[Online version](https://fbg-bitmap-font-creator.netlify.com/)

Features

* web fonts from [Google Fonts](https://fonts.google.com/?category=Monospace) & [Adobe Edge Web Fonts](https://edgewebfonts.adobe.com/fonts#/?class=monospaced) via [Web Font Loader](https://github.com/typekit/webfontloader) library
* support style / weight / variant and some glyph modifiers such as glyph scale
* ASCII font rendering preview (same algorithm as the fbg library)
* downloadable ASCII bitmap font (PNG)
* extensible; this tool is so simple that you can customize each glyph the way you want to and apply any sort of processing you want using the HTML5 Canvas API

This tool does not support user-font out of the box but use the Web Font Loader library so any custom fonts can be used as input by including it in the CSS through `font-face` property and modifying the way Web Font Loader load the font by using the `custom` property (see library documentation).

You can also get rid of the font loader code part and call the `render`  function with your font name if you use a custom font through CSS.

#### Rendering

This tool produce fixed width / height ASCII monospace bitmap font and does not produce a map file, each printable characters of the ASCII set should be linearly mapped in the rendering code.