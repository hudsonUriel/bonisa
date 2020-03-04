/*
* fileReader
* http://github.com/zmdy/bonisa
* MIT Licensed
*
* Copyright (C) 2020 Hudson Uriel Ferreira, http://gihub.com/zmdy
*
* -------------------- *
* 
* This is a simplistic class to read files and get it's content.
*
* HOW TO USE
*
* var test = fileReader.init();   // Creates the object
* test.readFile(myFile);          // Read a file
* console.log(test.content);      // Shows all loaded files content
*
*/
module.exports = {
  fileReader: ( function(){
    'use strict';
  
    // Basic definitions
    var fileReader = {
      files: [],
      content: [],
      creationTime: null
    };
  
    // Init function
    fileReader.init = function(){
      fileReader.creationTime = new Date();
  
      return fileReader;
    }
  
    // Read a textFile
    fileReader.readFile = function(file){
      // Requires the standard NODEJS file library
      var fs = require('fs');
  
      // Try open the file
      try {
        var data = fs.readFileSync(file, 'utf8');
        
        // Updates fileReader
        this.files.push(file);
        this.content.push(data.toString());
  
        return this;
      }
      // Otherwise, returns the error stack
      catch(e) {
      
        console.log('Error:', e.stack);
      }
    };
  
    // Read multiple files
    fileReader.readFiles = function(files){
      for(let file in files)
        fileReader.readFile(files[file]);
      
      return fileReader;
    };
  
    return fileReader;
  }())
}