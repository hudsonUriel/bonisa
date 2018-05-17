# BONISA.JS

Bonisa is a user-friendly framework to create dinamic, interactive and awesome HTML presentations, with:

* Graphics
* Animation Effects
* SVG
* Canvas
* 3D Objects
* Markdown
* Math Equations

## Think it, show it!

Bonisa is derivated from [reveal.js](https://github.com/hakimel/reveal.js/), an awesome JavaScript 
framework used to create HTML slides with a lot of cool extras and features:

* Nested Slides
* Markdwon Contents
* PDF Export
* Speaker Notes
* JS API
* Online Editor

With Bonisa, the inclusion of more dynamic and visual impacting elements in presentations will make them
more modern and interactive.

And more important: it must be easy, quick and free to use

## How to?

Like [reveal.js](https://github.com/hakimel/reveal.js/), Bonisa
is created with HTML, with an easy `main .bonisa > section` structure.

Each slide of the presentation is represented by a `section` element, while
the presentation itself is structured in a `main .bonisa` element.

### Semantics

The choice of slides as a `section` element was made according to [W3C](https://www.w3.org/TR/html52/),
in which the semantic meaning of HTML elements can:

* provide additional and critical functionalities to Assistive Technologies;
* provide valuable semantic informations;
* convey hints to Assistive Technologies and SEO's (Search Engines).

It means that the correct semantic structuring of a web-page or web-application is extremely important!
In this context, the semantic meaning of the `section` element, makes each individual slide
of the presentation works as a [thematic grouping of contents](https://www.w3.org/TR/html52/sections.html#sections).

The complete meaning of the presentation itself is made by using the grouping element `main`,
which [provides unique meaning to that document and excludes content that is repeated across others](https://www.w3.org/TR/html52/grouping-content.html#the-main-element).

In short, all of it means that each slide of the presentation is semantically independent,
but also part of a bigger content: the presentation itself.