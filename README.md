# BONISA.JS

![Bonisa Logo](./media/img/logo/svg/logo-full.svg)

Bonisa means "to show" in zulu language.

This is a personal framework used to build web-based presentations, with the power of JavaScript.

The main goal is to allow the easy insertion of graphic elements via JS libraries, creating awesome and modern presentations. 

Capabilites

* Charts
* Animation Effects
* SVG
* Canvas
* 3D Objects
* Markdown
* Math Equations

## Think it, show it!

Bonisa was originaly a ~framework~ set of JS scripts  built to allow the creation of [reveal.js](https://github.com/hakimel/reveal.js/) slides using _almost_ just Markdown text files for some personal projects, like [this one](https://zmdy.github.io/africa-perceptions/). After almost a full year without development, the project was brought back.

The goal now is to centralize a, at least, a little bit more complete framework to turn .md files in web-based presentations.

With Bonisa, the inclusion of more dynamic and visual impacting elements in presentations will make them more modern and interactive.

And more important: it must be easy, quick and free to use.

## How to?

The creation of presentations with Bonisa starts with the inclusion of the library in a HTML file.

```
<script src="bonisa.js"></script>
```

To begin a new presentation it's necessary to write a Markdown or AsciiDoc file containig the textual content of the presentation, like this:

```markdown
# Markdown

A presentation by [zmdy](https://github.com/zmdy)

***

# What is Markdown?

Markdown is a text format created in 2004 by [John Gruber](https://daringfireball.net/projects/markdown/).

***

> Markdown is a text-to-HTML conversion tool for web writers. Markdown allows you to write using an easy-to-read, easy-to-write plain text format, then convert it to structurally valid XHTML (or HTML). (...) The overriding design goal for Markdown’s formatting syntax is to make it as readable as possible. *John Gruber*
```

To loads this file and begins the show, it's just necessary to inform to Bonisa the file location. _Et voilà_, the presentation will begins!

```html
<script>
	// When the page loads...
	window.onload = function(){
		// Defines where your file is
		var myFile = 'path/to/my/file/myFile.md';
		
		// Initializes Bonisa with this text file
		Bonisa.init({
			file: myFile
		});
	}
</script>
```

***

# Frameworks

You can, of course, chose the library used to build the presentation.  By default, Bonisa will turn your text file in to a [reveal.js](https://github.com/hakimel/reveal.js/) presentation, with none stylesheet.

Bonisa allows you to use:

* [Reveal](https://github.com/hakimel/reveal.js/)
* [Impress](https://github.com/impress/impress.js/)
* [Bespoke](https://github.com/bespokejs/bespoke)
* [Big](https://github.com/tmcw/big)

You can create your own styles or used the ones available with the selected framework.

***

# How does it works?

When you calls the `bonisa.init` function, it will loads and process all of the configurations passed to it. Most of them are optional, but you can, of course, change it's values.

The most basic Bonisa options are the insertion of text files. You can open an unique or multiple text files, indicating it's location with the `dir` property.

| Property | Use | Example |
| --- | :---: | :---: |
| file | (REQUIRED) Defines an unique text file | `file: 'your/file/location/myFile.md'`|
| dir | (OPTIONAL) Defines a base directory to open the file(s). The default value is './' | `dir: 'your/files/location/folder'` |
| file + dir | (OPTIONAL) Defines several text files, in a specific directory | `dir: 'your/files/location/folder', file: ['file1.md', 'file2.md', 'file3.md']`|

When you defines a file name, Bonisa will get it's format - `fileFormat` - like md, adoc, txt, html... This `fileFormat` will be used soon, remember it!

Other very important Bonisa option is the framework used to construct the presentation.  The default Bonisa framework is [reveal.js](https://github.com/hakimel/reveal.js/), but you can change it using either `framework`, `tool` or `engine` properties, with these engine options:

* bespoke
* big
* impress
* reveal

| Property | Use | Example |
| --- | :---: | :---: |
| framework OR tool OR engine | (OPTIONAL) Defines the presentation framework | `tool: 'impress'`|

After choose the file(s) and the library, you can start the presentation with `Bonisa.init()`, as show above.

It's necessary to wait 1 second until all the libraries and files are read and ready.



```json
configs = {
	// Defines a single text file...
	file: 'your/file/location/myFile.md',
	
	// Defines lots of files...
 	file: ['file1.md', 'file2.md', 'file3.md'],
	// ... all of them stored in this directory (folder)
	dir: 'your/files/location/folder'
					 
}

```