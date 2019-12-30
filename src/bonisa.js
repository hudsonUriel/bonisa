/*
* Bonisa
* http://github.com/zmdy/bonisa
* MIT Licensed
*
* Copyright (C) 2019 Hudson Uriel Ferreira, http://gihub.com/zmdy
*
* -------------------- *
* 
* Welcome!
*
* This is the source-code of BONISA library, a JavaScript 
* tool developed to creat web-based presentations from simple
* text files (in Markdown, ASCIIDOC, txt, etc).
*
* BONISA is an open-source project distributed under MIT License.
* Be FREE to use it, and if you want to, be free to make it better ;)
*
* Without further ado, allons-y!
*/

/** 
* When everything is ok, BONISA is acessible through
* the navigator itself by the object Bonisa.
*
* If you opens the console, present in the dev-tools of your browser,
* and type Bonisa you will see a object with some properties.
* Soon, we will explore all of them.
* 
* The start point of everything is down here.
*/
var Bonisa = (function () {
  // A simple command to make JS code more secure and with better syntax/logic
  'use strict';

  // Local variables
  var
    Bonisa = {
      version: '1.1-alpha',
      engines: {
        reveal: ['div.reveal>div.slides>section', 'div.reveal>div.slides>section>section'],
        impress: ['div#impress>div.step']
      }
    },
    waitTime = 500; // WAIT TIME (miliseconds)
  ;

  // Sleep function used to wait the dependiencies (and other stuff) opens
  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  // Here is where all the magic happens...
  /*
  * This function is used to starts the presentation.
  *
  * @since  1.0-alpha
  * 
  * @param  {Object}  objectVar   Configuration properties of the presentation.
  *
  *
  * @return {type} Return value description.
  */
  Bonisa.init = function (configs) {
    // Normalizes the input
    configs = typeof configs == 'object' ? configs : {
      configs
    };

    // Declares the basic properties
    var 
      callback,   // Callback function
      config,     // Configuration function
      delimiter,  // Delimter(s) used to spilt textual content
      delimiters,
      dir,        // Base file directory
      engine,     // Engine (tool/library) used to make the presentations
      file,       // File(s) used to create the presentation
      process,    // Special function
      style;      // Set (loads) the styles of the presentation

    // Gets the configuration properties
    callback = configs.callback || Bonisa.createSlides;
    config = configs.options || configs.configs || {};
    delimiters = configs.delimiters || ['---', '___', '***'];
    dir = configs.dir || './';
    engine = configs.engine || configs.framework || configs.tool || 'reveal';
    file = configs.file || null;
    process = configs.process || function () {};
    style = configs.themes || configs.styles || [];

    // If there is no file, returns an error
    if (!file) {
      Bonisa.error();
      return -1;
    } // Otherwise it will works just fine
    
    // Get the current location
    Bonisa.location =
      window.location.protocol + '//' +
      window.location.host + '/' +
      window.location.pathname.replace('/', '').split('/')[0];

    // Get the file AND file(s) format
    Bonisa.file = file;
    Bonisa.fileFormat = file.split('.')[file.split('.').length - 1];

    // Get the directory
    Bonisa.dir = dir;

    // Get the delimiter
    Bonisa.delimiters = delimiters;

    // Make sure that a valid engine is selected
    Bonisa.engine = Bonisa.engines.hasOwnProperty(engine) ? engine : 'reveal';
    Bonisa.callback = callback;

    // Defines the used structure
    Bonisa.structure = Bonisa.engines[Bonisa.engine];

    // Get the configurations
    Bonisa.config = config;
    Bonisa.process = process;

    // Get the styles
    Bonisa.styles = Array.isArray(style) ? style : [style];

    // Get the dependencies
    Bonisa.dependencies = configs.dependencies;

    // Creats the wait page
    Bonisa.createWait();

    // Load the necessary libraries/dependencies
    Bonisa.loadDependencies();

    // Waits a little time until everything is loaded...
    sleep(waitTime).then(() => {
      // Defines which convert library to use
      switch (Bonisa.fileFormat) {
        case 'md':
          Bonisa.convert = marked;
          break;
        case 'adoc':
          Bonisa.convert = asciidoctor.convert;
          break;
      }

      // Creates the framework structure
      Bonisa.configStructure();

      // Opens the file(s)
      Bonisa.openFiles();

      // Personal configurations
      Bonisa.process();

      // Stylizes
      Bonisa.stylize();

      // Configures the framework
      Bonisa.configEngine();
    });
  };

  
  // Configures the content tree of the presentation
  Bonisa.configContentTree = function(content){
    var contentTree = {}, genericRegexp = [],
    contentTest, lastDelimiter = 1, lastSlide = 0, initDelimiters;

    // In Brazilian Portuguese, we call this stuff 'gambiarra'
    initDelimiters = Bonisa.delimiters;
    initDelimiters = initDelimiters.toString();

    // Turn all delimiters in to regexp
    for (let d in Bonisa.delimiters) {
      var regexp = '^';
      for (let c in Bonisa.delimiters[d]) 
        regexp += '\\u00' + Bonisa.delimiters[d].charCodeAt(c).toString(16);
      
      genericRegexp.push(regexp.replace('^', ''));
      Bonisa.delimiters[d] = RegExp(regexp + '$', 'gm');
    }

    genericRegexp = RegExp('^(' + genericRegexp.join('|')+')$', 'gm');
    contentTest = content.split(genericRegexp);
    initDelimiters = initDelimiters.split(',');

    // Process the contentTree
    for(let slide in contentTest){
      if(contentTest[slide].replace(genericRegexp,"")){
        contentTree['slide'+lastSlide] = {
          'content': contentTest[slide],
          'level': initDelimiters.indexOf(contentTest[lastDelimiter])
        };
        lastSlide++;
      } else{
        lastDelimiter = slide;
      }
    }

    // Returns
    return contentTree;
  };
  
  // Configures the Engine, opening the necessary files
  Bonisa.configEngine = function () {
    var
      baseDir = Bonisa.location + '/libs/',
      script, link;

    // Creates the script and the link
    script = document.createElement('script');
    link = document.createElement('link');

    script.src = baseDir + Bonisa.engine + '/' + Bonisa.engine + '.min.js';

    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = baseDir + Bonisa.engine + '/' + Bonisa.engine + '.min.css';

    // Appends in the end of the document
    document.body.appendChild(script);
    document.body.appendChild(link);

    sleep(waitTime).then(() => {
      // Initializes the slide
      Bonisa.wait.style.display = 'none';

      switch (Bonisa.engine) {
        case 'reveal':
          Reveal.initialize(Bonisa.config);
          break;
        case 'impress':
          impress().init(Bonisa.config);
          break;
      }
    });
  };

  // Creates and configures the structure
  Bonisa.configStructure = function(){
    var
      frameworkStructure = [];
    
    // For each division in the Bonisa.structure array
    for(let level in Bonisa.structure){
      // Gets the structure
      var
        structure = Bonisa.structure[level].split('>');

      // Analyses each structure to create an element
      for(let area in structure){
        var 
          element = structure[area],
          elementType,
          identification = {},
          parent,
          selector;

        // Gets the identification (id or class) attribute used
        if(element.split('#') != element)
          identification['id'] = element.split('#')[1];
        else if(element.split('.') != element)
          identification['class'] = element.split('.')[1];
        
        // Gets the element type of the structure
        elementType = element.split(/\u0023|\u002e/gm)[0];

        // Gets the current selector
        selector = area == 0 ? 'body' : structure[area - 1];
        selector += '>' + structure[area];
        
        // Gets the current parent
        parent = area == 0 ? 'body' : frameworkStructure[area - 1]['selector'];

        // Checks if the element exists
        if(! document.querySelector(selector)){
          // Creates the element
          element = document.createElement(elementType);

          // Sets each attribute
          for(let prop in identification)
            element.setAttribute(prop, identification[prop]);
          
          frameworkStructure[area] = {
            'element': element,
            'parent': parent,
            'selector': selector
          };

          // Append it (if it's a correct structure)
          parent = document.querySelector(parent);
          
          if(area < Bonisa.structure.length) parent.appendChild(element);
        }
      }
    }
    
    Bonisa.structure = frameworkStructure.slice(Bonisa.structure.length);
  };

  // Creates the presentation itself
  Bonisa.createSlides = function (content) {
    // Defines the last 1st-level slide
    var lastSlide = [];

    // Starts all the last slides with a default value
    for(let level in Bonisa.structure)
      lastSlide[level] = 0;

    // Get all local links and put them in to absolute paths
    content = relativize(content);

    // Configures the contentTree
    content = Bonisa.configContentTree(content);
    Bonisa.content = content;

    Bonisa.slides = [];

    // Converts the text AND creates the slide
    for (let c in content) {
      var
        clone,
        cloneParent,
        parent,
        slide,
        structure;
        
      // Adjusts the level(s) of the content
      if(content[c].level >= Bonisa.structure.length)
        content[c]['level'] = Bonisa.structure.length - 1;
      
      // Gets the object structure (content, parent, structure)
      structure = Bonisa.structure[ content[c].level ];
      
      // Turns the textual content in to HTML
      content[c].content = Bonisa.convert(content[c].content);

      // Creates a clone node AND inserts the content
      clone = structure.element.cloneNode(true);
      clone.innerHTML = content[c].content;

      // Defines the slide
      slide = {
        'content': clone,
        'id': 'bonisa' + Bonisa.slides.length,
        'level': content[c].level,
        'isParent': false
      };

      // Appends the content of multi-level slides
      if(slide.level > 0){
        // Gets the right parent of the current slide
        parent = Bonisa.slides[ lastSlide[slide.level - 1]];

        // Clones the parent
        cloneParent = parent.content.cloneNode(true);
        
        // Make sure that all contents are correctly shown
        if(parent.isParent == false){
          parent.isParent = true;
          // Re-clones the default object
          parent.content.innerHTML = null;
          parent.content.appendChild(cloneParent);
        }
        
        // Updates
        parent = parent.content;
        lastSlide[slide.level] ++;
      } else{
        parent = document.querySelector(structure.parent);
        lastSlide[0] = Bonisa.slides.length;
      }
      
      // Appends it
      parent.appendChild(clone);
      Bonisa.slides.push(slide);
    }
  };

  // This is showed when everything is still loading
  Bonisa.createWait = function () {
    var wait = document.createElement('div');

    wait.innerHTML = Bonisa.wait || "<img src='" + Bonisa.location + "/media/img/loading.gif' style='width:15vw;margin-left:42.5%;margin-top:32.5vh;margin-bottom:2%;'>\n<p style='text-align: center;'>Loading... please, wait...</p>";

    wait.style.display = 'inline-block';
    wait.style.visibility = 'visible';
    wait.style.width = '100vw';
    wait.style.height = '100vh';

    document.body.appendChild(wait);

    Bonisa.wait = wait;
  };

  // Error message
  Bonisa.error = function () {
    console.log("%cYou've got an error message, don't you? If you did, read this: ", "color: #44d; font-weight: bold; font-size: 1.5em;");

    console.log("%cHouston, we've got a problem...\n\n%cIt's kind of... impossible to create a presentation without a text file. To configure it do this:\n\n%cBonisa.init({\n\tfile: 'yourFileName.extension',\n\tdir: 'file/directory/location',\n\tengine: 'engine-name'\n});", "color: #111; text-transform: uppercase; font-size: 1.25em; font-weight: bold;", "color: #111;", "color: #44f; font-family: monospace; padding: 2%;");

    alert("ERROR: No input file was selected to create the presentation. Open DevTools (F12) to more details ;)");
  };

  // Loads the requested and obligatory dependencies
  Bonisa.loadDependencies = function () {
    var
      dependencies = ['jshashes'],
      formats = {
        'md': 'marked',
        'adoc': 'asciidoctor'
      };
    
    // Check if it is an Array
    Bonisa.dependencies = Array.isArray(Bonisa.dependencies) ?
      Bonisa.dependencies.push(formats[Bonisa.fileFormat]) : [formats[Bonisa.fileFormat]];
    
    Bonisa.dependencies = Bonisa.dependencies.concat(dependencies);
    
    // Opens each dependecie
    for (let dep in Bonisa.dependencies) {
      
      var lib = document.createElement('script');
      lib.src = Bonisa.location + '/libs/' + Bonisa.dependencies[dep] + '/' + Bonisa.dependencies[dep] + '.min.js';
      document.head.appendChild(lib);
    }
  };

  // Teaches the computer how to make a pancake...
  Bonisa.openFiles = function () {
    var
      file = Array.isArray(Bonisa.file) ? Bonisa.file : [Bonisa.file];

    // Opens each file
    for (let f in file) {
      openFile(
        Bonisa.dir + file,
        file[f].split('.')[file[f].split('.').length - 1],
        Bonisa.callback
      );
    }
  };

  // Apply the selected styles
  Bonisa.stylize = function () {
    // Opens all styles
    for (let style in Bonisa.styles) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = Bonisa.styles[style];
    }
  };
    
  return Bonisa;
}());
