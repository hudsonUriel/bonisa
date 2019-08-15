/*
* Bonisa
* http://github.com/zmdy/bonisa
* MIT Licensed
*
* Copyright (C) 2019 Hudson Uriel Ferreira, http://gihub.com/zmdy
*/

/*
* Main function
*/

var Bonisa = (function (){
	'use strict';
	
	// Local variables
	var 
		Bonisa = {
			version: '1.0-alpha',
			engines: {
				reveal: 'div.reveal div.slides section', 
				impress: 'div#impress div.step'
			}
		},
		// Functions
		init
	;
	
	Bonisa.init = function(configs){
		// Normalizes the input
		configs = typeof configs == 'object' ? configs : {configs};
		
		// Get the basic properties
		var
			file,
			dir,
			engine,
			callback;
		
		file = configs.file || null;
		dir = configs.dir || './';
		engine = configs.engine || configs.framework || configs.tool || 'reveal';
		callback = configs.callback || Bonisa.createSlide;
		
		// If there is no file, returns an error
		if(!file){Bonisa.error(); return -1;}

		// Otherwise, let's play the game
		Bonisa.file = file;
		Bonisa.dir = dir;
		// Make sure that a valid engine is selected
		Bonisa.engine = Bonisa.engines.hasOwnProperty(engine) ? engine : 'reveal';
		Bonisa.callback = callback;
		
		// Creates the framework structure
		Bonisa.configEngine();
		
		// Opens the file(s)
		Bonisa.openFiles();
		
		// Fix the references (links)
	};
	
	Bonisa.openFiles = function(){
		var 
			file = Array.isArray(Bonisa.file) ? Bonisa.file : [Bonisa.file];
		
		for(let f in file){
			openFile(
				Bonisa.dir + file,
				file[f].split('.')[file[f].split('.').length - 1],
				Bonisa.callback
			);
		}
	}
	
	Bonisa.error = function(){
		 console.log("%cYou've got an error message, don't you? If you did, read this: ", "color: #44d; font-weight: bold; font-size: 1.5em;");
		
		console.log("%cHouston, we've got a problem...\n\n%cIt's kind of... impossible to create a presentation without a text file. To configure it do this:\n\n%cBonisa.init({\n\tfile: 'yourFileName.extension',\n\tdir: 'file/directory/location',\n\tengine: 'engine-name'\n});", "color: #111; text-transform: uppercase; font-size: 1.25em; font-weight: bold;", "color: #111;", "color: #44f; font-family: monospace; padding: 2%;");

		alert("ERROR: No input file was selected to create the presentation. Open DevTools (F12) to more details ;)");
		
		console.log()
	}
	
	Bonisa.fixLocations = function(){
		/*
		* MAKE THE LOCATIONS RELATIVE
		*/
	}
	
	Bonisa.configEngine = function(){
		var
			structure = {
				'.': 'className',
				'#': 'id'
			},
			frameworkStructure;
		
		frameworkStructure = Bonisa.engines[Bonisa.engine];
		
		frameworkStructure = frameworkStructure.split(' ');

		for(let area in frameworkStructure){
			var
				identification = frameworkStructure[area].replace('#', '') != frameworkStructure[area] ? 'id' : 'className',
				element,
				parent;

			parent = frameworkStructure[area].replace(/(\u0023|\u002e)/g, ' ').split(' ');

			// Creates the object
			element = document.createElement(parent[0]);
			element[identification] = parent[1];

			// Append it
			parent = frameworkStructure[area - 1] || 'body';
			document.querySelector(parent).appendChild(element);
		}
		
		Bonisa.slide = element;
		return element;
	}
	
	Bonisa.createSlide = function(content){
		content = relativeReference(content);
		content = content.split('---');

		for(let c in content){
			var 
				elm = Bonisa.slide.cloneNode(true);

			elm.innerHTML += marked(content[c]);
			Bonisa.slide.parentElement.appendChild(elm);
		}

		Bonisa.slide.parentElement.removeChild(Bonisa.slide);
	}
	
	return Bonisa;
}());