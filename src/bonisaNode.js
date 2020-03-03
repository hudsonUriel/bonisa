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
* In this implementation, NodeJS is being used as the JavaScript
* engine of the tool, encapsulating the most complex operations.
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
      version: '1.0-node',
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
    //loadDependencies();

    // Waits a little time until everything is loaded
    sleep(waitTime).then(() => {
      // Calls all necessary functions to make Bonisa works
      //process();
      
      if(file)
        console.log("Ok");
        //openFiles(); // Opens the file(s)
      else
        console.log("Content");
        //Bonisa.callback ( {content: textContent} );
      
      // Waits a little bit more to starts the presentation
      sleep(waitTime).then( () => {
        //start();

      // Deletes temporary properties
      //delete(Bonisa.configConvert);
      //delete( Bonisa.location );
      //delete( Bonisa.slides );
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
    callback = configs.callback || 'createSlides';
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

  // This is showed when everything is still loading
  Bonisa.createWait = function () {
    var wait = document.createElement('div');

    wait.id = 'bonisaWait';
    wait.style.display = 'inline-block';
    wait.style.visibility = 'visible';
    wait.style.width = '100vw';
    wait.style.height = '100vh';

    wait.innerHTML = '<h1>Loading presentation...</h1>';

    document.body.appendChild(wait);
    
    Bonisa.wait = wait;
  };
  
  return Bonisa;
}());