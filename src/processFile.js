/*
* Bonisa
* http://github.com/zmdy/bonisa
* MIT Licensed
*
* Copyright (C) 2019 Hudson Uriel Ferreira, http://gihub.com/zmdy
*/

/*
* Opens file
*/
function openFile(file, fileFormats, callbackFunctions){
	'use strict';
	
	// Creates the request
	var 
	    request = new XMLHttpRequest(),
		rtr;
	
	// Creates array
	fileFormats = Array.isArray(fileFormats) ? fileFormats : [fileFormats];
	callbackFunctions = Array.isArray(callbackFunctions) ? callbackFunctions : [callbackFunctions];

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
	    if (request.readyState === 4) {
			var format = file.split('.')[file.split('.').length - 1].toLowerCase();
			
			for(let formats in fileFormats){
				
				if(format == fileFormats[formats]){
					try{
							callbackFunctions[formats](request.responseText);
				    } catch (err){
					    console.error(err);
								console.log(callbackFunctions[formats] + " is not a function!");
					    continue;
				    }
				}
			}
			
			var rtrn = request.responseText;
		}
	};
    
	return request;
}