/*
* Bonisa
* http://github.com/zmdy/bonisa
* MIT Licensed
*
* Copyright (C) 2019 Hudson Uriel Ferreira, http://gihub.com/zmdy
*/

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
		format = properties.format || file.split('.').slice(-1)[0]
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
					callbackFunction({content: request.responseText, file: file, fileFormat: format});
			} catch (err){
				console.error(err);
				console.log("No function was passed as argument.");
				return -1;
			}
		}
	};
    
	return request;
}