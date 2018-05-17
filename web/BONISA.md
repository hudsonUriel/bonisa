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

Like [reveal.js](https://github.com/hakimel/reveal.js/), Bonisa main structure
is created with HTML, with an easy `.bonisa > section` wrapper.

Each slide of the presentation is represented by a `section` element, by default.
However it can be changed with the built-in function:


```
function(){
    bonisa.structure({structure: type});
}
```