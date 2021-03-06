/*
* Bonisa
* http://github.com/zmdy/bonisa
* MIT Licensed
*
* Copyright (C) 2020 Hudson Uriel Ferreira, http://gihub.com/zmdy
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

var Bonisa = ( function(){
  // A simple command to make JS code more secure and with better syntax/logic
  'use strict';

  // Local variables
  var
    Bonisa = {
      version: '1.1-alpha',
      engines: {
        impress: ['div#impress>div.step'],
        reveal: ['div.reveal>div.slides>section', 'div.reveal>div.slides>section>section']
      }
    },
    waitTime = 500; // WAIT TIME (miliseconds)
  ;

  // Sleep function used to wait the dependiencies (and other stuff) opens
  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  // Here is where all the magic happens...
  Bonisa.init = function (configs) {
    // Normalizes the input
    configs = typeof configs == 'object' ? configs : {
      configs
    };

    // Get the file(s) necessary to the presentation
    var
      file = configs.file || null,
      textContent = configs.content || null;

    // If there is no file, returns an error
    if (!file & !textContent) {
      Bonisa.error();
      return -1;
    } // Otherwise it will works just fine
    
    // Get and configures all necessary properties
    config(configs);

    // Load the necessary libraries/dependencies
    loadDependencies();

    // Waits a little time until everything is loaded
    sleep(waitTime).then(() => {
      // Calls all necessary functions to make Bonisa works
      process();
      
      if(file)
        openFiles(); // Opens the file(s)
      else
        Bonisa.callback ( {content: textContent} );
      
      // Waits a little bit more to starts the presentation
      sleep(waitTime).then( () => {
        start();

      // Deletes temporary properties
      delete(Bonisa.configConvert);
      delete( Bonisa.location );
      delete( Bonisa.slides );
      });
    });
  };

  // Configures all Bonisa properties
  function config(configs){
    // Declares the basic properties
    var 
      callback,       // Callback function
      config,         // Configuration function
      delimiters,     // Delimter(s) used to spilt textual content
      dependencies,   // Necessary dependecies
      dir,            // Base file directory
      engine,         // Engine (tool/library) used to make the presentations
      file,           // File(s) used to create the presentation
      process,        // Special function
      style,          // Set (loads) the styles of the presentation
      textContent;

    // Gets the configuration properties
    callback = configs.callback || createSlides;
    config = configs.options || configs.configs || {};
    delimiters = configs.delimiters || ['---', '___', '***'];
    dependencies = config.dependencies || [];
    dir = configs.dir || './';
    engine = configs.engine || configs.framework || configs.tool || 'reveal';
    file = configs.file || null;
    process = configs.process || function () {};
    style = configs.themes || configs.styles || [];
    textContent = configs.content || null;

    // Get the current location
    Bonisa.location =
    window.location.protocol + '//' +
    window.location.host + '/' +
    window.location.pathname.replace('/', '').split('/')[0];

    // If there are text files to be loaded
    if(file){
      // Get the file(s) AND file(s) format
      Bonisa.file = file;
      Bonisa.file = Array.isArray(Bonisa.file) ? Bonisa.file : [Bonisa.file];
      Bonisa.fileFormat = [];

      // Set fileFormats
      for(let file in Bonisa.file)
        Bonisa.fileFormat.push(Bonisa.file[file].split('.').slice(-1)[0]);

      // Get the directory
      Bonisa.dir = dir;
    }else{
      // Defines the textContent
      Bonisa.textContent = textContent;

      // Configures the fileFormat
      configs.fileFormat = configs.fileFormat == null ? ['md'] : configs.fileFormat;
      Bonisa.fileFormat = Array.isArray( configs.fileFormat ) ? configs.fileFormat : [ configs.fileFormat ];
    }

    // Defines the content
    Bonisa.content = [];

    // Get the dependencies
    Bonisa.dependencies = dependencies;

    // Get the delimiter
    Bonisa.delimiters = {
      text: delimiters,
      regexp: []
    }
    
    // Turn all delimiters in to regexp
    for (let d in Bonisa.delimiters.text) {
      var regexp = '^';
      for (let c in Bonisa.delimiters.text[d]) 
        regexp += '\\u00' + Bonisa.delimiters.text[d].charCodeAt(c).toString(16);
      
      Bonisa.delimiters.regexp.push(regexp.replace('^', ''));
    }

    Bonisa.delimiters.regexp = RegExp('^(' + Bonisa.delimiters.regexp.join('|')+')$', 'gm');

    // Make sure that a valid engine is selected
    Bonisa.engine = Bonisa.engines.hasOwnProperty(engine) ? engine : 'reveal';
    Bonisa.callback = callback;

    // Defines the used structure
    Bonisa.structure = Bonisa.engines[Bonisa.engine];
    Bonisa.slides = {length: 0, content: [], lastParent: []};

    // Get the configurations
    Bonisa.config = config;
    Bonisa.process = process;

    // Set the convert functions
    Bonisa.convert = {};

    // Get the styles
    Bonisa.styles = Array.isArray(style) ? style : [style];

    // Creats the wait page
    Bonisa.createWait();
  }

  // Configures the Engine, opening the necessary files
  function configEngine() {
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
        case 'impress':
          impress().init(Bonisa.config);
          break;
        case 'reveal':
          Reveal.initialize(Bonisa.config);
          break;
      }
    });
  };

  // Configures the content tree of the presentation
  function configContentTree(content){
    var
      contentTree = {}, 
      contentTest,
      lastDelimiter = 1;
    
    contentTest = content.split(Bonisa.delimiters.regexp);

    for(let slide in contentTest){
      // If the content is not a delimiter
      if(contentTest[slide].replace(Bonisa.delimiters.regexp, "") != ''){
        contentTree['slide' + Bonisa.slides.length] = {
          'content': contentTest[slide],
          'level': Bonisa.delimiters.text.indexOf(contentTest[lastDelimiter]),
          'isParent': false
        };

      // Adjusts the level(s) of the content
      if(contentTree['slide' + Bonisa.slides.length]['level'] 
        >= Bonisa.structure.length)

          contentTree['slide' + Bonisa.slides.length]['level'] = Bonisa.structure.length - 1;

        Bonisa.slides.length++;

      } else{
        lastDelimiter = slide;
      }
    }

    // Returns
    return contentTree;
  };

  // Loads the requested and obligatory dependencies
  function loadDependencies() {
    var
      dependencies = [],
      formats = {
        'md': 'marked',
        'adoc': 'asciidoctor'
      };
    
    // Get all dependencies
    for(let format in Bonisa.fileFormat)
      if(dependencies.indexOf( formats[Bonisa.fileFormat[format]] ) == -1)
        dependencies.push(formats[Bonisa.fileFormat[format]]);

    Bonisa.dependencies = dependencies;
    
    // Opens each dependecie
    for (let dep in Bonisa.dependencies) {
      
      var lib = document.createElement('script');
      lib.src = Bonisa.location + '/libs/' + Bonisa.dependencies[dep] + '/' + Bonisa.dependencies[dep] + '.min.js';
      document.head.appendChild(lib);
    }
  };

  // Processes everything
  function process(){
    // Configures the convertion libraries
    Bonisa.configConvert();

    // Creates the framework structure
    createStructure();
  }

  // Starts the presentation itself
  function start(){
    // Personal configurations
    Bonisa.process();

    // Stylizes
    Bonisa.stylize();

    // Configures the framework
    configEngine(); // WORKS AS START
  }

  // Soon will be implemented
  function createSlides(content){
    // Configures the content
    configContent(content);

    // Makes the individual slides
    for(let ctnt in content.content){
      var
        currentSlide = content.content[ctnt];
      
      // If no textFile was informed, configures the currentSlide.fileFormat property
      if(!currentSlide.fileFormat)
        currentSlide.fileFormat = Bonisa.fileFormat[0];

      // Turns the content in HTML
      currentSlide.content = Bonisa.convert[currentSlide.fileFormat]( 
        currentSlide.content
      );
      
      // Configures the current slide
      currentSlide = configSlide(currentSlide);
      
      // Creates the slide ID and Classname
      currentSlide.structure.id += 'bonisaSlide' + ctnt.replace(/\D/g, '');
      currentSlide.structure.className += 'bonisa';

      // Appens the content
      currentSlide.parent.appendChild( currentSlide.structure );
    }
  }

  function configSlide(slide){
    var  
      clone;  

    // Defines the structure of the slide
    slide.structure = Bonisa.structure[ slide.level ].element.cloneNode(true);
    
    // Inserts the content
    slide.structure.innerHTML = slide.content;

    if(slide.level == 0){
      // Defines the parent
      slide.parent = document.querySelector(
        Bonisa.structure[ 0 ].parent
      );

      // Updates
      Bonisa.slides.lastParent[ slide.level ]++;
      Bonisa.slides.content.push( slide );

    }else{
      // Defines the parent
      slide.parent = Bonisa.slides.lastParent[ slide.level - 1 ] - 1;
      
      // Updates the parent
      if( Bonisa.slides.content[slide.parent].isParent == false){
        // Updates the isParent flag
        Bonisa.slides.content[slide.parent].isParent = true;

        // Creates a new object with the 2nd slide level
        clone = Bonisa.structure[1].element.cloneNode(true);
        clone.innerHTML = Bonisa.slides.content[
          slide.parent
        ].structure.cloneNode(true).innerHTML;

        // Sets the id and class
        clone.id += 'bonisaSlide' + slide.parent;
        clone.className += 'bonisa';

        // Cleans its original content
        Bonisa.slides.content[slide.parent].structure.innerHTML = '';
        
        // Puts the original content within itself
        Bonisa.slides.content[slide.parent].structure.appendChild ( clone );
      }

      // Gets the updated parent
      slide.parent = Bonisa.slides.content[slide.parent].structure ;
    }
    
    return slide;
  }

  function configContent(content){
    // Get all local links and put them in to absolute paths
    content.content = relativize(content.content);
    
    // Configures the contentTree
    content.content = configContentTree(content.content);

    // Gets the file format of each slide
    // (this way all file formats can be correctly converted)
    for(let ctnt in content.content)
      content.content[ctnt]['fileFormat'] = content.fileFormat
    
    // Assigns the newly slides to the Bonisa object
    Object.assign(Bonisa.content, content.content);
  }

  // Creates and configures the structure
  function createStructure(){
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
    
    // Defines the root structure
    Bonisa.rootStructure = frameworkStructure[0].selector;
    document.querySelector( Bonisa.rootStructure ).id += 'bonisaRoot';

    // Defines the engine-structure used in the presentation
    Bonisa.structure = frameworkStructure.slice(Bonisa.structure.length);
  };

  // Teaches the computer how to make a pancake...
  function openFiles() {
    // Opens each file
    for (let file in Bonisa.file) {
      openFile(
        {
          file: Bonisa.dir + Bonisa.file[file],
          callback: Bonisa.callback
        }
      );
    }
  };

  // Clears (deletes) the full presentation - future implementation
  Bonisa.clear = function(){
    // Gets the presentation
    var presentation = document.querySelector(Bonisa.rootStructure);

    // Deletes the presentation
    presentation.parentNode.removeChild( presentation );
  }

  // Configures/sets the convertion library(ies) used
  Bonisa.configConvert = function(){
    // Sets Bonisa convert function for each file
    for(let file in Bonisa.fileFormat){
      var fct;  

      // Defines which convert library to use
      switch (Bonisa.fileFormat[file]) {
        case 'md':
          fct = marked;
          break;
        case 'adoc':
          fct = asciidoctor.convert;
          break;
      }
      
      // If the function was not yet declared, make it so
      if(!Bonisa.convert[ Bonisa.fileFormat[file] ])
        Bonisa.convert[ Bonisa.fileFormat[file] ] = fct;
    }

    // Sets the Bonisa.slides.lastParent flag with default value
    for(let i=0; i<Bonisa.structure.length; i++)
      Bonisa.slides.lastParent[ i ] = 0;
  }

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

  // Apply the selected styles
  Bonisa.stylize = function() {
    // Opens all styles
    for (let style in Bonisa.styles) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = Bonisa.styles[style];

      document.head.appendChild(link);
    }
  };

  /*
  * Generic function to open text files and process them
  */
  function openFile(properties){
    'use strict';

    // Creates the request
    var 
      request = new XMLHttpRequest(),

      file = properties.file,
      callbackFunction = properties.callback,
      format = properties.format || file.split('.').slice(-1)[0],
      id = properties.id || null
    ;
    
    // Try opens the file using GET method
    try{
      request.open('GET', file);
    } catch(err){
      console.error(err);
      console.log("Attempt failed!");
      return -1;
    }
    
    // Sends the request
    request.send();
    
    // When file is opened
    request.onreadystatechange = function () {
      // If we already have a full response
      if (request.readyState === 4) {
        try{
            callbackFunction({content: request.responseText, id: id, file: file, fileFormat: format});
        } catch (err){
          console.error(err);
          console.log("No function was passed as argument.");
          return -1;
        }
      }
    };
      
    return request;
  }

  /*
  * Searches for local links and turn them in to absolute paths
  */
  function relativize(content){
    var 
      content ,
        
      link,
      curLocation = window.location,
      rtr,
      
      // Defines a link as something that:
      // Starts with ./ OR ../ OR /
      // Don't have //
      // Ends with a word or /
      regex = /^(\u002E{1,2}\u002F|\u002F{1})[^\u002F].{1,}(\u002F|\w{1,})$/gm,
      hName = curLocation.hostname,
      pName = curLocation.pathname.replace('/','').split('/')[0];
    
    rtr = content;
    
    // Splits the content by " " or "[" or "]" or "(" or ")" or "{" or "}"
    content = content.split(/( |\u0028|\u0029|\u005B|\u005D|\u007B|\u007D)/);
    
    // Search for links
    for(let str in content){
      // Test if it is a link
      if(regex.test(content[[str]])){
        link = content[str];
          
        var
          newLink = Bonisa.location + '/' + link.replace(/\u002E+\u002F/g, "");

        rtr = rtr.replace(link, newLink);
      }
    }
    
    return rtr;
  }
  
  return Bonisa;
}());