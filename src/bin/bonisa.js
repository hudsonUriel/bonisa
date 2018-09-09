/*!
 * bonisa.js
 * 
 * github.com/hudsonUriel/bonisa
 * gitlab.com/zmdy/bonisa
 * 
 * AGPL-3.0 licensed
 * 
 * Copyright (C) 2018 Hudson Uriel
 *
 */

/*
 * *************** | FUNCTION | ***************
 * 
 * Anonymous self-invoking function
 * 
 * ********************************************
 * 
 * This function recieves the Window object
 * and an anonymous function that defines
 * all Bonisa features, making it available
 * to the global scope
 * 
 * ********************************************
 * 
 * @param {Window} root
 * @param {function} factory
 * @returns {void}
 * 
 */
(function(root, factory){
    // To be used in Node
        if(typeof exports === 'object'){
            module.exports = factory();
        }else{
            // Make Bonisa Global to the Browser
            root.Bonisa = factory();
        }
    
    // Calling Bonisa - TEST
    root.Bonisa.init();
    
}(this, function(){
    // using strict mode
    'use strict';
    
    /* ---------- INITIAL VARIABLES ---------- */
    var 
        // Bonisa object
        Bonisa, 
        
        // Bonisa version
        VERSION = '0.1',
        
        // Bonisa selectors
        WRAPPER_SELECTOR = "main.bonisa",
        SLIDES_SELECTOR = "main.bonisa>section",
        
        // Bonisa classes
        WRAPPER_CLASS = "bonisaWrapper",
        SLIDES_CLASS = "bonisaSlide",
        
        // Current Slide
        CURRENT_SLIDE = null,
        slidev = 0,
        slideh = 0,
        
        // Bonisa functions
            // Help functions
            help, htmlHelp, showModules,  
            
            // Initialize function
            init,
            
            // Load function
            load,
            
            // Start function
            start,
            
        // Bonisa flags
            // Modules
            modules = {available: [
                    // Bonisa available modules
                        // Showdown = Markdown to HTML Converter
                        {
                            name: 'showdown',
                            version: '^1.8.6',
                            description: 'Markdown to HTML Converter',
                            keywords: ['md', 'mdconverter', 'md2html'],
                            first: '0.0.3',
                            last: VERSION,
                            status: 'available',
                            file: '/showdown/dist/showdown.js',
                            loaded: false
                        }
                    ],
                    
                    // Bonisa loaded modules
                        loaded: [],
                        
                    // Directory for modules scripts
                        modulesDir: '../src/node_modules/'
            },
            
            // Structure - DOM Reference
            dom = {},
            
            // Slides configurations
            config = {
                // Slide default size
                width: "1280px",
                height: "720px",
                
              // Enable use of keyboard
                keyboard: true
            },
            
            // Shosrtcuts
            keyboardShortcuts = {
              // 'N  ,  SPACE':			'Next slide',
              // 'P':					'Previous slide',
              // 'B  ,  .':				'Pause',
              // 'F':					'Fullscreen',
              // 'ESC, O':				'Slide overview'
              '&#8592;  ,  H':		'Navigate left',
              '&#8594;  ,  L':		'Navigate right',
              '&#8593;  ,  K':		'Navigate up',
              '&#8595;  ,  J':		'Navigate down',
              'Home':					'First slide',
              'End':					'Last slide'
            },
            
        // Generic flags
            // Is initialized
            initialized = false,
            
            // Is loaded
            loaded = false
        ; 
    
    /* --------------- FUNCTIONS --------------- */
    
    init = function(params){
        // Initializes just once
            // Check
            if(initialized === true){return;}
                
            // Change initializes flag
            initialized = true;
        
        //
        // Check user agent
        //
        
        // Check params
        if(params){
            console.log('\nReceived the params: ' + JSON.stringify(params) + '\n\n');
            
            // Check modules and load them
                if(params.modules){
                    load(params.modules);
                }
                
            //
            // Here will be included codes to allow
            // slides creation with just .md/.json
            // and DOM
            //
            
        }
       
        // Start slides structure
            start();
    };
    
    /*
     * Loads bonisa external modules
     * @returns {undefined}
     */
    load = function(modules){
        // Turn modules to Array
            if(! modules instanceof Array)
                modules = new Array(modules);
        
        // Check if the requested modules are available
            modules.forEach(function(mod){
                // Convert to lowercase string
                mod = mod.toString().toLowerCase();

                
                // Search modules and make them
                // loaded just once
                Bonisa.modules.available.forEach(function(bonisaModule){
                    // Search by name
                    if(bonisaModule.name === mod && !bonisaModule.loaded){
                        // Change module.loaded to 'true'
                        bonisaModule.loaded = true;
                        
                        // Load the module
                        Bonisa.modules.loaded[Bonisa.modules.loaded.length] = bonisaModule;
                    }
                    
                    // Search by keyword
                    else{
                        bonisaModule.keywords.forEach(function(keyword){
                            if(keyword === mod && !bonisaModule.loaded){
                                // Change module.loaded to 'true'
                                bonisaModule.loaded = true;
                                
                                // Load the module
                                Bonisa.modules.loaded[Bonisa.modules.loaded.length] = bonisaModule;
                            }
                        });
                    }
                });
            });
        
        // Load requested modules
        Bonisa.modules.loaded.forEach(function(mod){
            // Try require() -- for Node use
            try{
                require(mod.name);
                console.log('\nNODE -- ' + mod.name);
            }
            catch(err){
                // Catch an error
                
                // Dynamic includes the module
                    var
                        // 'script' DOM  element
                        modScript = document.createElement('script');
                        
                        // 'script' source file
                        modScript.src = 
                            // Module directory    
                            Bonisa.modules.modulesDir + 
                            
                            // Module file
                            mod.file
                    ;
                        
                    // Appends
                    document.head.appendChild(modScript);
            }
        });

        // that's all
        console.log('Bonisa modules are loaded!')  ;
    };
    
    start = function(){
        // Change loaded flag to "true"
            loaded = true;
            
        // Basic DOM structure
            setupDOM();
    };
    
    /*
     * NOTE: All sub-functions will
     * be defined directly;
     * 
     * Main funtion( start, load, init)
     * will be defined as anonymous
     */
    
    function setupDOM(){
        // Check if the document loading is complete
           document.onreadystatechange = function(){
                if(document.readyState === "complete"){
                    // Get the wrapper and the slides
                        dom.wrapper = document.querySelector(WRAPPER_SELECTOR);
                        dom.slides = [];
                        
                        // uses aux for store all main.bonisa>section
                        var aux = document.querySelectorAll(SLIDES_SELECTOR);

                        // Auxiliary class for wrapper
                            dom.wrapper.classList.add(WRAPPER_CLASS);

                        // Search the valids slides
                            for(var i=0; i<aux.length; i++){
                                // Check the element
                                if(aux[i].parentNode.classList.contains(WRAPPER_CLASS)
                                ){
                                    // Includes in the dom.slides cache
                                    dom.slides[dom.slides.length] = aux[i];

                                    // Change className
                                    dom.slides[i].classList.add(SLIDES_CLASS);
                                }
                            }
                            
                    // Reconfigure the width and height
                        config.width = window.innerWidth;
                        config.height = window.innerHeight;
                        
                    // Configures the presentation
                      configure();
                      
                    // Add the event listeners
                      eventListenters();
                }
            };
    }
    
    function configure(){
      // Configures WRAPPER_SELECTOR and SLIDES_SELECTOR
        document.querySelector(WRAPPER_SELECTOR).style.width = "100vw";
        document.querySelector(WRAPPER_SELECTOR).style.height = "100vh";

        document.querySelectorAll(SLIDES_SELECTOR).forEach(function(element){
          element.style.width = "100vw";
          element.style.height = "100vh";

          element.style.position = "absolute";

          element.style.display = "none";
        });
    };
    
    function eventListenters(){
      console.log("Event listeners added :)");
      if(config.keyboard){
        document.addEventListener('keydown', onDocumentKeyDown, false);
        document.addEventListener('keypress', onDocumentKeyPress, false);
      }
    };
    
    function onDocumentKeyDown( event ){
      console.log(event.keyCode);
    };
    
    function onDocumentKeyPress( event ){
      console.log(event);
    };
    
    /*
     * *************** | HELP Functions | ***************
     * 
     * Returns the standard variable "textHelp" as:
     * 
     * --> Pure String [md formated]: help()
     * --> HTML formated: htmlHelp()
     * 
     * ******************************************** 
     * 
     * @returns {String}
     */
    help = function(){
        return(
            'Welcome to Bonisa ' + VERSION + '\n' +
            'COMMANDS\n' +
            '[... INSERT COMANDS ...]'
        );
    };
    
    htmlHelp = function(){
        return(help().toString().replace('\n', '<br/>'));
    };
    
    showModules = function(){
        console.log('Showing the modules \n\n' + JSON.stringify(Bonisa.modules.available));
    };
    
    /* ------------------ API ------------------ */
    Bonisa = {
        // Version
        version: VERSION,
        
        // Help functions
        help: help,
        htmlHelp: htmlHelp,
        showModules: showModules,
        
        // Main functions
        init: init,
        load: load,
        start: start,
        
        // Structure
        structure: dom,
        
        // Modules
        modules: modules
    };
    
   
    /* ----------------- RETURNS ---------------- */
    return Bonisa;
}));