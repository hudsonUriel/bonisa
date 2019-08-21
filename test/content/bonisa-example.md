# BONISA.JS

![Bonisa Logo](../../media/img/logo/svg/logo-full.svg)

---

# Think it, show it!

Bonisa means "to show" in zulu language. This is a personal framework used to build web-based presentations, with the power of JavaScript.

---

# Presentations made easy

The main goal of Bonisa is to allow that simple text files, in [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet), [Asciidoc](http://asciidoc.org/), [HTML](https://www.w3.org/html/) or any other format you want to in to web-based presentations.

---

# How to?

To use Bonisa you just need a text file (I strongly recommend Markdown or Asciidoc), like this one:

```
# Markdown

A presentation by [zmdy](https://github.com/zmdy)

***

# What is Markdown?

Markdown is a text format created in 2004 by [John Gruber](https://daringfireball.net/projects/markdown/).

***

> Markdown is a text-to-HTML conversion tool for web writers. Markdown allows you to write using an easy-to-read, easy-to-write plain text format, then convert it to structurally valid XHTML (or HTML). (...) The overriding design goal for Markdown’s formatting syntax is to make it as readable as possible. *John Gruber*

```

---

# Markdown It!

When you use a text file to create a slide you must, somehow, indicate where the individual slides begins and finishes, right?

To make it, you just need use a marker in your text file. In Markdown there are 3 different Horizontal rules. You need use, at least 3 of them (*** or ___ or ---)

* Underscores (_)
* Hyphens (-)
* Asterisks (*)

---

# Bonisa

After you write your Markdown file, you need create a very, very basic HTML file (to opens your presentation). On it, you will open the Bonisa JS file:

`<script src='bonisa.js'></script>`

---

# Bonisa

Now, you just need to indicate to Bonisa which file it's going to read... _et voilà_!

```
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

---

# Frameworks 

By default, Bonisa will turn your text file in to a [reveal.js](https://github.com/hakimel/reveal.js/) presentation, with none stylesheet.

Bonisa allows you to use:

* [Reveal](https://github.com/hakimel/reveal.js/)
* [Impress](https://github.com/impress/impress.js/)
* [Bespoke](https://github.com/bespokejs/bespoke)
* [Big](https://github.com/tmcw/big)

You can create your own styles or used the ones available with the selected framework.