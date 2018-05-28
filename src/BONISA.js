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
    window.Bonisa = factory();
}(this, function(){
    /* ---------- INITIAL VARIABLES ---------- */
    var 
        // null object
        Bonisa, 
        
        // Bonisa version and codename
        VERSION = '1.0.0';
    
    /* --------------- FUNCTIONS --------------- */
    
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
    
    /* ------------------ API ------------------ */
    Bonisa = {
        version: VERSION,
        
        help: help,
        htmlHelp: htmlHelp
    };
    
    /* ----------------- RETURNS ---------------- */
    return Bonisa;
}));