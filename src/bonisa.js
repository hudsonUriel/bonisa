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
* the browser itself by the object Bonisa.
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
      version: '1.2-alpha',
      engines: {
        impress: ['div#impress>div.step'],
        reveal: ['div.reveal>div.slides>section', 'div.reveal>div.slides>section>section']
      }
    },
    
    // WAIT TIME (miliseconds)
    waitTime = 500,

    // Declares the basic directories used
    __SLIDE_DIR   = './',
    __CONTENT_DIR = __SLIDE_DIR + 'content/',
    __SRC_DIR  = __SLIDE_DIR + 'src/'
  ;

  // Sleep function used to wait the dependiencies (and other stuff) opens
  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  // Here is where all magic happens
  Bonisa.init = function(configs){
    // Normalizes the input
    configs = typeof configs == 'object' ? configs : {
      configs
    };

    // Get the file(s) necessary to the presentation
    var
      file = configs.file || null,
      textContent = configs.content || null,
      
      // Basic directories used
      SLIDE_DIR = configs.SLIDE_DIR || null,
      CONTENT_DIR =  configs.CONTENT_DIR || null,
      SRC_DIR = configs.SRC_DIR || null
    ;

    // Updates the basic directories
    __SLIDE_DIR = SLIDE_DIR || __SLIDE_DIR;
    __CONTENT_DIR = CONTENT_DIR || __CONTENT_DIR;
    __SRC_DIR = SRC_DIR || __SRC_DIR;

    // Defines Bonisa paths
    Bonisa.SLIDE_DIR = __SLIDE_DIR;
    Bonisa.CONTENT_DIR = __CONTENT_DIR;
    Bonisa.SRC_DIR = __SRC_DIR;
    Bonisa.THEMES_DIR = __SRC_DIR + 'themes/';
    Bonisa.LIBS_DIR = __SRC_DIR + 'libs/',

    // Creats the wait page
      Bonisa.createWait();

    // If there are text files, open them
    if(file){
      // Defines file format
      configs.fileFormat = [];

      // Defines the read content
      Bonisa.fileContent = [];
      Bonisa.fileFormat = [];

      // Creates an array of files
      file = Array.isArray(file) ? file : [file];

      // Process al text files
      processFiles(file);

      // Process the text content and makes everything else
      sleep(waitTime * file.length).then(() => {
        processContent(Bonisa.fileContent, configs);

        // Final configurations
        postConfig();
        
      });      
    } else{
      processContent(textContent, configs);

      // Final configurations
      postConfig();
    }
  }

  /********** 1st step = get the configurations and loads the dependencies **********/
    // Configures all Bonisa properties
    function config(configs){
      // Declares the basic properties
      var 
        // Callback function
        callback = configs.callback || createSlides,
        
        // Configuration function
        config = configs.options || configs.configs || {},

        // Decode URI content
        decode = true,

        // Delimiter(s) used to spilt textual content
        delimiters = configs.delimiters || ['---', '___', '***'],

        // Necessary dependencies
        dependencies = config.dependencies || [],

        // Engine (tool/library) used to make the presentations
        engine = configs.engine || configs.framework || configs.tool || 'reveal',

        // Special function
        process = configs.process || function () {},

        // Set (loads) the styles of the presentation
        style = configs.themes || configs.styles || [],

        // Defines the content of the presentation
        textContent = configs.content || null,

        // Defines the content of the presentation
        title = configs.title || 'Bonisa Presentation';
      
      // Get the current location
      Bonisa.location = 
        window.location.host + '/' +
        window.location.pathname.replace('/', '').split('/')[0] + '/';

      // Defines the textContent
      Bonisa.textContent = textContent;

      // Defines the page title
      Bonisa.title = title;
      document.title = Bonisa.title;

      // Defines the decode mode
      Bonisa.decode = decode;

      // Configures the fileFormat
      configs.fileFormat = configs.fileFormat == null ? ['md'] : configs.fileFormat;
      
      if(!Bonisa.fileFormat)
        Bonisa.fileFormat = Array.isArray( configs.fileFormat ) ? configs.fileFormat : [ configs.fileFormat ];

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
    }

    // Loads the requested and obligatory dependencies
    function loadDependencies() {
      var
        dependencies = [],
        formats = {
          'md': 'marked',
          'adoc': 'asciidoctor'
        };
      
      // Update the wait page
      Bonisa.wait.innerHTML += "<p>Loading dependencies...</p>";
      
      // Get all dependencies
      for(let format in Bonisa.fileFormat)
        if(dependencies.indexOf( formats[Bonisa.fileFormat[format]] ) == -1)
          dependencies.push(formats[Bonisa.fileFormat[format]]);

      Bonisa.dependencies = dependencies;
      
      // Opens each dependencies
      for (let dep in Bonisa.dependencies) {
        
        var lib = document.createElement('script');
        lib.src = __SRC_DIR + 'libs/' + Bonisa.dependencies[dep] + '/' + Bonisa.dependencies[dep] + '.min.js';
        document.head.appendChild(lib);
        
      }
    };

    // Loads text files, if requested
    function openFile(properties){
      'use strict';

      // Creates the request
      var 
        request = new XMLHttpRequest(),

        file = properties.file,
        callbackFunction = properties.callback,
        encode = properties.encode
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
              if(encode)
                callbackFunction(
                  encodeURI(request.responseText)
                );
              else
                callbackFunction(
                  request.responseText
                );
          } catch (err){
            console.error(err);
            console.log("No function was passed as argument.");
            return -1;
          }
        }
      };
        
      return request;
    }

    async function processFiles(files){
      var
        filesFormat = [];

      for(let file in files){
        // Defines the text file with it's location
        files[file] = __CONTENT_DIR + files[file];

        // Defines the file format
        Bonisa.fileFormat.push(files[file].split('.').slice(-1)[0]);

        // Opens the current text file
        openFile({
            file: files[file],
            callback: Bonisa.setFileContent,
            encode: files.length > 1 ? true: false
          });

        // Updates the progress
        Bonisa.wait.innerHTML +=
          "<p>Reading file " + 
          (parseInt(file)+1) +  
          " of " + files.length + "</p>"
        ;
        
        // Waits
        await sleep(waitTime);
      }

      // Turns the array in string
      Bonisa.fileContent = encodeURI(Bonisa.fileContent.join('\n'));

      await sleep(waitTime);
    
      return filesFormat;
    }

    function processContent(textContent, configs){
      // If there is no content returns an error
      if (!textContent) {
        Bonisa.error();
        return -1;
      } // Otherwise it will works just fine

      // Otherwise, do it:
      config(configs);

      // Load the necessary libraries/dependencies
      loadDependencies();

      // Waits a little time until everything is loaded
      sleep(waitTime).then(() => {
        // Calls all necessary functions to make Bonisa works
        process();

        // Configures the content
        if(Bonisa.decode){
          //console.log(textContent);
          textContent = decodeURI(textContent);
          Bonisa.wait.innerHTML += "<p>Decoding text(s) contents.</p>";
        }
          
        try{
          Bonisa.callback ( {content: textContent} );
          
        }catch (err){
          Bonisa.wait.innerHTML += '<strong>Error configuring presentation content! Try reloads the page (F5)!</strong>';
          console.error(err);
          return -1;
        }
        
        // Waits a little bit more to starts the presentation
        sleep(waitTime).then( () => {
          start();
        
        // Deletes temporary properties
        delete( Bonisa.configConvert );
        delete( Bonisa.location );
        delete( Bonisa.slides );
        delete( Bonisa.fileContent );
        });
      });
    }

  /********** 2nd step = pre-configure everything **********/
    // Processes everything
    function process(){
      // Update the wait page
      Bonisa.wait.innerHTML += "<p>Creating empty structure...</p>";

      // Configures the conversion libraries
      Bonisa.configConvert();

      // Creates the framework structure
      createStructure();
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

  /********** 3rd step = configure the content & creates the structure **********/

    // Configure the slides
    function createSlides(content){
      // Update the wait page
      Bonisa.wait.innerHTML += "<p>Configuring content...</p>";

      // Configures the content
      configContent(content);

      // Makes the individual slides
      for(let ctnt in content.content){
        var
          currentSlide = content.content[ctnt];
        
        // If no content was informed, configures the currentSlide.fileFormat property
        if(!currentSlide.fileFormat)
          currentSlide.fileFormat = Bonisa.fileFormat[0];

        // Turns the content in HTML
        currentSlide.content = Bonisa.convert[currentSlide.fileFormat]( 
          currentSlide.content
        );
        
        // Configures the current slide
        currentSlide = configSlide(currentSlide);

        // Appends the content
        currentSlide.parent.appendChild( currentSlide.structure );
      }
    }

    // Configure the content in slides
    function configContent(content){
      // Get all local links and put them in to absolute paths
      // content.content = relativize(content.content);
      
      // Configures the contentTree
      content.content = configContentTree(content.content);

      // Gets the file format of each slide
      // (this way all file formats can be correctly converted)
      for(let ctnt in content.content)
        content.content[ctnt]['fileFormat'] = content.fileFormat
      
      // Assigns the newly slides to the Bonisa object
      Object.assign(Bonisa.content, content.content);
    }

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
            'level': Bonisa.delimiters.text.indexOf(contentTest[lastDelimiter]) >=0 ? Bonisa.delimiters.text.indexOf(contentTest[lastDelimiter]) : 0,
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

    // Configure the slides with the selected structure
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

  /********** 4th step = loads the engine and starts the show **********/
    // Starts the presentation itself
    function start(){
      // Update the wait page
      Bonisa.wait.innerHTML += "<p>Finishing presentation...</p>";

      // Personal configurations
      Bonisa.process();

      // Stylizes
      Bonisa.stylize();

      // Configures the framework
      configEngine(); // WORKS AS START
    }

    // Apply the selected styles
    Bonisa.stylize = function() {
      // Opens all styles
      for (let style in Bonisa.styles) {
        var
          link = document.createElement('link'),
          script = document.createElement('script')
        ;

        // Gets the stylesheet
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = Bonisa.THEMES_DIR + Bonisa.styles[style] + '/' + Bonisa.styles[style] + '.css';
        
        // Gets the (optional) script
        script.src = Bonisa.THEMES_DIR + Bonisa.styles[style] + '/' + Bonisa.styles[style] + '.js';

        // Appends it
        document.head.appendChild(link);

        // Try opens the scripts
        try{
          document.head.appendChild(script);
        } catch(err){
          console.warn('The requested Bonisa theme "' + Bonisa.styles[style] + '" doesn\'t have a related script file - "' + Bonisa.styles[style] + '.js"');
        }

        // Try opens the script function
        try{
          sleep(waitTime).then(() => {
            window[Bonisa.styles[style]]();
          });  
          
          
        } catch(err){
          console.warn('The requested Bonisa theme "' + Bonisa.styles[style] + '" doesn\'t have a related script function: theme_' + Bonisa.styles[style] + '() not found!');
        }
      }
    };

    // Configures the Engine, opening the necessary files
    function configEngine() {
      var
        script, link;

      // Creates the script and the link
      script = document.createElement('script');
      link = document.createElement('link');

      script.src = Bonisa.LIBS_DIR + Bonisa.engine + '/' + Bonisa.engine + '.min.js';

      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = Bonisa.LIBS_DIR + Bonisa.engine + '/' + Bonisa.engine + '.min.css';

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

    function postConfig(){
      sleep(waitTime).then(() => {
        for(let ctnt in Bonisa.content){
          // Defines the generic slide classname
          Bonisa.content[ctnt].structure.className += 'bonisa';

          // Defines the slide ID
          Bonisa.content[ctnt].structure.id += 'bonisaSlide' + ctnt.replace(/\D/g, '');
        }
      });
    }

  /********** Bonisa necessary functions **********/

    // Configures/sets the conversion library(ies) used
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
            fct = Asciidoctor.convert;
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

      wait.id = 'bonisaWait';

      wait.innerHTML = Bonisa.wait || "<p>Preparing presentation...</p>";

      document.body.style.overflow = 'hidden';
      wait.style.display = 'inline-block';
      wait.style.visibility = 'visible';
      wait.style.width = '100%';
      wait.style.height = '100%';
      wait.style.textAlign = 'center';

      document.body.appendChild(wait);

      Bonisa.wait = wait;
    };

    // Error message
    Bonisa.error = function () {
      console.log("%cYou've got an error message, don't you? If you did, read this: ", "color: #44d; font-weight: bold; font-size: 1.5em;");

      console.log("%cHouston, we've got a problem...\n\n%cIt's kind of... impossible to create a presentation without a text file. To configure it do this:\n\n%cBonisa.init({\n\tfile: 'yourFileName.extension',\n\tdir: 'file/directory/location',\n\tengine: 'engine-name'\n});", "color: #111; text-transform: uppercase; font-size: 1.25em; font-weight: bold;", "color: #111;", "color: #44f; font-family: monospace; padding: 2%;");

      alert("ERROR: No input file was selected to create the presentation. Open DevTools (F12) to more details ;)");
    };

    Bonisa.setFileContent = function(content){
      Bonisa.fileContent.push(content);
    }

  return Bonisa;
}());