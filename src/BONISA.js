/*!
 * bonisa.js
 * AGPL-3.0 licensed
 *
 * 
 * --> this file is a bonisa.js modification
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
    root.Bonisa = factory();
    
    root.Bonisa.init({modules: 'pdf'});
}(this, function(){
    // using strict mode
    'use strict';
    
    /* ---------- INITIAL VARIABLES ---------- */
    var 
        // Bonisa object
        Bonisa, 
        
        // Bonisa version
        VERSION = '0.0.3',
        
        // Bonisa functions
            // Help functions
            help, htmlHelp, showModules,  
            
            // Initialize function
            init,
            
            // Load function
            load,
       
//        // Bonisa modules
//            // Showdown: Markdown Converter
//            Showdown,
            
        // Bonisa flags
            // Is initialized
            initialized = false,
            
            // Modules
            modules = {available: [
                    // Bonisa available modules
                        // Showdown = Markdown to HTML Converter
                        {name: 'showdown', first: '0.0.3', last: null}
                    ],
                        loaded: null
            }
        
        ;
    
    // Bonisa Dependencies
        // Markdown to HTML converter
            // Showdown = require('showdown');
            
    
//    var showdown  = require('showdown'),
//     converter = new showdown.Converter(),
//     text      = '#hello, markdown!',
//     html      = converter.makeHtml(text);
    
    
    
    /* --------------- FUNCTIONS --------------- */
    
    init = function(params){
        // Initializes just once
            // Check
            if(initialized === true){return;}
                
            // Change initializes flag
            initialized = true;
        
        // Check user agent
        
        // Check params
        if(params){
            console.log('\nReceived the params: ' + JSON.stringify(params));
            
            // Check modules
                if(params.modules){
                    load(params.modules);
                }
        }
        
        
    };
    
    /*
     * Loads bonisa external modules
     * @returns {undefined}
     */
    load = function(modules){
        // check if module are available
                    
        // load modules

        // that's all
        
        console.log('Bonisa is loaded!')  ;
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
        console.log('Showng the modules');
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
        
        // Modules
    };
    
   
    /* ----------------- RETURNS ---------------- */
    return Bonisa;
}));