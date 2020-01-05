# BONISA.JS

![Bonisa Logo](./media/img/logo/svg/logo-full.svg)

Bonisa means "to show" in the Zulu language.

This is a personal framework used to build web-based presentations, with the power of JavaScript.

The main goal is to allow the easy insertion of graphic elements via JS libraries, creating awesome and modern presentations. 

Capabilities

* Charts
* Animation Effects
* SVG
* Canvas
* 3D Objects
* Markdown
* Math Equations

## Think it, show it!

Bonisa was originally a ~framework~ set of JS scripts built to allow the creation of [reveal.js](https://github.com/hakimel/reveal.js/) slides using _almost_ just Markdown text files for some personal projects, like [this one](https://zmdy.github.io/africa-perceptions/). After almost a full year without development, the project was brought back.

The goal now is to centralize a, at least, a little bit more complete framework to turn .md files in web-based presentations.

With Bonisa, the inclusion of more dynamic and visual impacting elements in presentations will make them more modern and interactive.

And more important: it must be easy, quick and free to use.

## How to?

The creation of presentations with Bonisa starts with the inclusion of the library in an HTML file.

```
<script src="bonisa.js"></script>
```

To begin a new presentation it's necessary to write a Markdown or AsciiDoc file containing the textual content of the presentation, like this:

```markdown
# Markdown

A presentation by [zmdy](https://github.com/zmdy)

***

# What is Markdown?

Markdown is a text format created in 2004 by [John Gruber](https://daringfireball.net/projects/markdown/).

***

> Markdown is a text-to-HTML conversion tool for web writers. *John Gruber*
```

To loads this file and begins the show, it's just necessary to inform Bonisa the file location. _Et voilà_, the presentation will begin!

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

## What's new?

* `sep-02-19` [First Alpha Version](https://github.com/zmdy/bonisa/releases/tag/v1.0-alpha)
  * All basic functions of reading and processing the files, creating the basic presentation (horizontal presentations) structures and appending the textual content to it are done.
  * Allows the creation of web-based presentations with MARKDOWN and ASCIIDOC text files;
  * Allows the use of Reveal or Impress presentation frameworks;
  * Do not support additional styles or standard templates of graphic elements
* `jan-05-20` [Version 1.1.alpha](https://github.com/zmdy/bonisa/releases/tag/v1.0-alpha)
  * Allows the creation of multi-level web-based presentations with MARKDOWN and ASCIIDOC text files;
  * Allows the use of multiple files

***

# Frameworks

You can, of course, chose the library used to build the presentation.  By default, Bonisa will turn your text file into a [reveal.js](https://github.com/hakimel/reveal.js/) presentation, with none stylesheet.

Bonisa allows you to use:

* [Reveal](https://github.com/hakimel/reveal.js/)
* [Impress](https://github.com/impress/impress.js/)

You can create your own styles or using the ones available with the selected framework.

***

# How does it works (the basic stuff)?

When you call the `bonisa.init` function, it will loads and process all of the configurations passed to it. Most of them are optional, but you can, of course, change their values.

The most basic Bonisa option is the insertion of text files. You can open an unique or multiple files, indicating it's location with the `dir` property.

| Property | Use | Example |
| --- | :---: | :---: |
| file | (REQUIRED) Defines an unique text file | `file: 'your/file/location/myFile.md'`|
| dir | (OPTIONAL) Defines a base directory to open the file(s). The default value is './' | `dir: 'your/files/location/folder'` |
| file + dir | (OPTIONAL) Defines several text files, in a specific directory | `dir: 'your/files/location/folder', file: ['file1.md', 'file2.md', 'file3.md']`|

When you use a text file to create a slide you must, somehow, indicate where the individual slides begin and finishes in your file, right?

To make it, you just need to use a marker in your text file. Every markup language has its own structures. Markdown, for example, have the `---`, `***` and `___` flags to indicate horizontal rules, which visually split and organizes your textual content.

The standard Bonisa marker flag is `---`, but you can change it through the property `delimiter` when you call `bonisa.init`. This delimiter will be processed as an individual line beginning with the defined pattern.

The delimiter is used to indicate to Bonisa where to split your text file to generates the individual slides of the presentation. It's important to remember that your file needs to be parsed into HTML (because you can write your text file in *any* markup language you want to).

This process is made by a callback function, that receives your brute text content as an argument. By default, Bonisa has a built-in function to do all the job, but you can override it with the property `callback` or `createSlide`.

Other very important Bonisa option is the framework used to construct the presentation.  The default Bonisa framework is [reveal.js](https://github.com/hakimel/reveal.js/), but you can change it using either `framework`, `tool` or `engine` properties, with these engine options:

* impress
* reveal

| Property | Use | Example |
| --- | :---: | :---: |
| framework OR tool OR engine | (OPTIONAL) Defines the presentation framework | `tool: 'impress'`|
| delimiter | (OPTIONAL) Defines the marker used to split the text file in slides | `delimiter: '***'`|
| callback OR screateSlide | (OPTIONAL) Defines the function used to create the slides | `callback: myFunction`|

Every JS presentation framework is, basically, a set of textual and non-textual contents within specific HTML elements or structures. These elements are configured, via JavaScript and CSS, to be shown as presentations, one slide at a time.

In reveal.js, for example, each slide is a HTML `<section>` element inserted in to a `div.reveal > div.slides` structure. Therefore, when your text file content is split by the `delimiter`, each item of the array will be turned in to something just like this (if the framework is [reveal.js](https://github.com/hakimel/reveal.js/)):

```html
<div class='reveal'>
	<div class='slides'>
		<section>
			<h1>This is the first slide</h1>
		</section>
	
		<section>
			<h1>This is the second slide</h1>
		</section>
	</div>
</div>
```

Once your HTML presentation is done, you can configure extra styles and JavaScript functionalities using the properties `style` and `process`. By default, each presentation will load the basic stylesheet of the framework.

| Property | Use | Example |
| --- | :---: | :---: |
| styles OR themes | (OPTIONAL) Loads the presentation styles | `style: 'style1.css'`|
| styles OR themes | (OPTIONAL) Loads the presentation styles | `style: ['style1.css', 'style2.css']`|
| process | (OPTIONAL) Defines a processing function to your presentation | `process: processPresentation()`|

***

# The Bonisa object

Once you open your presentation is opened in a web-browser, Bonisa will be accessible via the `Bonisa` object.

This object contains all functions and options necessary to make Bonisa works. The most important ones are shown below:

```json
Bonisa = {
	callback: ƒ (content),
	config: {},
	configConvert: ƒ (),
	content: [slide0: {…}, slide1: {…}, slide2: {…}, slide3: {…}, slide4: {…}, …],
	convert: {md: ƒ, adoc: ƒ},
	createWait: ƒ (),
	delimiters: {text: Array(3), regexp: /^(\u002d\u002d\u002d|\u005f\u005f\u005f|\u002a\u002a\u002a)$/gm},
	dependencies: (2) ["marked", "asciidoctor"],
	dir: "./",
	engine: "reveal",
	engines: {impress: Array(1), reveal: Array(2)},
	error: ƒ (),
	file: ["bonisa-example.md", "bonisa-example.adoc"],
	fileFormat: ["md", "adoc"],
	init: ƒ (configs),
	process: ƒ (),
	structure: (2) [{…}, {…}],
	styles: [],
	stylize: ƒ (),
	version: "1.1-alpha",
	wait: div
}
```

| Property | Type | Definition |
| --- | :---: | :---: |
| callback | Function | Function to turn the text `content` in to a presentation |
| config | Object | Options passed to the `Bonisa.init` function |
| content | Array of Objects | Presentation content, including the text content, file(s) format, slide(s) level, etc |
| convert | Function | Function used to parse the text content to HTML |
| createWait | Function | Function used to creates the 'wait' element, showed when the presentation is not started yet |
| delimiters | String | Delimiters used to split the text content |
| dependencies | Array | Libraries used to makes everything works |
| dir | (OPTIONAL) Defines a base directory to open the file(s). The default value is './' | `dir: 'your/files/location/folder'` |
| engine OR framework OR tool | String | Defines the presentation framework |
| engines | Array | All available Bonisa engines |
| error | Function | Bonisa special function to informs when an error has happened |
| file | Array of Strings | Text file(s) |
| fileFormat | Array of Strings | Text file(s) formats |
| init | Function | Bonisa special function to creates the presentation with the required parameters |
| process | Function | Defines a processing function to your presentation |
| strucutre | Array | Query structure of the framework presentation |
| styles OR themes | String OR Array | Loads the presentation styles |
| stylize | Function | Function used to stylizes the presentation. By default opens all the stylesheets defined in `styles` |
| version | String | Bonisa version |
| wait | DOM | Element showed when the presentation is not started yet|

***

# License

Bonisa is distributed under the [MIT License](https://opensource.org/licenses/MIT), a *short and simple permissive license with conditions only requiring preservation of copyright and license notices.* ([Choose a License](choosealicense.com))

- Be free to:
  - :heavy_check_mark: Distribute
  - :heavy_check_mark: Copy
  - :heavy_check_mark: Modify
  - :heavy_check_mark: Publish
  - :heavy_check_mark: Make commercial use
  - :heavy_check_mark: Make private use
  - :heavy_check_mark: Make derivate works with different license
  - :heavy_check_mark: Do whatever you want (literally)

- But, do not forget to:
  - :heavy_minus_sign: Keep a copy of the LICENSE and the copyright notice

Keep in mind that this project and all of yours constituents have **no warranties**. Neither the author nor the licenses are responsible for any damages or liabilities arising from the use of this project or its constituents.