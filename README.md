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

With Bonisa, the inclusion of more dynamic and visual impacting elements in presentations will (i hope so...) make them more modern and interactive.

And more important: it must be easy, quick and free to use.

## How to?

The creation of presentations with Bonisa starts with the inclusion of the library in a HTML file.

```
<script src="bonisa.js"></script>
```

The Bonisa library will start the job as soon as the page is opened. To begin a new presentation it's necessary to write a Markdown or AsciiDoc file containig the textual content of the presentation, like this:

```
# My First Presentation
## by: Someone

---

# This is the first slide.

---

# This is the slide #2

And it have a little text somewhere about something

---

You can put list here too...
* Like this
* one
* over
* here
* ...

---

And whatever else you want to

```

To loads this file and begins the show, it's just necessary to inform to Bonisa the file location and some minor configurations.

```
presentationConfig = {
		file: 'fileName.extension',
		dir: 'fileLocation',
		tool: 'fileFramework',

		libs: ['anime', 'd3', 'typed'],

		subject: 'Presentation subject/theme',
		author: 'Author Name',
		lang: 'language',
		date: '01/01/01',
		license: 'CC-BY',
		comments: 'Presentation notes or comments'
	};
	
	Bonisa.init(presentationConfig);
```

You need, of course, chose the library used to build the presentation, like Reveal, Impress, Bespoke...

(IN PROGRESS...)

Each slide of the presentation is represented by a `section` element, while
the presentation itself is structured in a `main .bonisa` element.

### Semantics

The choice of slides as a `section` element was made according to [W3C](https://www.w3.org/TR/html52/),
in which the semantic meaning of HTML elements can:

* provide additional and critical functionalities to Assistive Technologies;
* provide valuable semantic informations;
* convey hints to Assistive Technologies and SEO's (Search Engines).

It means that the correct semantic structuring of a web-page or web-application is extremely important! In this context, the semantic meaning of the `section` element, makes each individual slide of the presentation works as a [thematic grouping of contents](https://www.w3.org/TR/html52/sections.html#sections).

The complete meaning of the presentation itself is made by using the grouping element `main`,
which [provides unique meaning to that document and excludes content that is repeated across others](https://www.w3.org/TR/html52/grouping-content.html#the-main-element).

In short, all of it means that each slide of the presentation is semantically independent,
but also part of a bigger content: the presentation itself.
