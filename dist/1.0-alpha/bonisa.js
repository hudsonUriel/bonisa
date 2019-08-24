/*
* Bonisa
* http://github.com/zmdy/bonisa
* MIT Licensed
*
* Copyright (C) 2019 Hudson Uriel Ferreira, http://gihub.com/zmdy
*
* Version: 1.0-alpha
* 23-08-2019
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
	
	// Sleep function
	const sleep = (milliseconds) => {
		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}
	
	// Here is where all the magic happens...
	Bonisa.init = function(configs){
		// Normalizes the input
		configs = typeof configs == 'object' ? configs : {configs};
		
		// Get the basic properties
		var file, dir, engine, callback, delimiter, config, process, style;
		
		// Basic configuration properties
		file = configs.file || null;
		dir = configs.dir || './';
		engine = configs.engine || configs.framework || configs.tool || 'reveal';
		callback = configs.callback || Bonisa.createSlide;
		delimiter = configs.delimiter || '---';
		config = configs.options || configs.configs || {};
		process = configs.process || function(){};
		style = configs.themes || configs.styles || [];
		
		// If there is no file, returns an error
		if(!file){Bonisa.error(); return -1;}

		// Get the current location
		Bonisa.location = 
			window.location.protocol + '//' +
			window.location.host + '/' +
			window.location.pathname.replace('/','').split('/')[0];
		
		// Otherwise, let's play the game
		Bonisa.file = file;
		Bonisa.fileFormat = file.split('.')[file.split('.').length - 1];
		
		Bonisa.dir = dir;
		
		// Get the delimiter
		Bonisa.delimiter = delimiter;
		
		// Make sure that a valid engine is selected
		Bonisa.engine = Bonisa.engines.hasOwnProperty(engine) ? engine : 'reveal';
		Bonisa.callback = callback;
		
		// Defines the used structure
		Bonisa.structure = Bonisa.engines[Bonisa.engine];
		
		// Get the configurations
		Bonisa.config = config;
		Bonisa.process = process;
		
		// Get the styles
		Bonisa.styles = Array.isArray(style) ? style : [style];
		
		// Get the dependencies
		Bonisa.dependencies = configs.dependencies;
		
		// Creats the wait page
		Bonisa.createWait();
		
		// Load the necessary libraries/dependencies
		Bonisa.loadDependencies();
		
		// Waits a little time until everything is loaded...
		sleep(500).then(() => {
		    // Creates the framework structure
		    Bonisa.configStructure();
		
				// Opens the file(s)
		    Bonisa.openFiles();
				
				// Personal configurations
				Bonisa.process();
			
				// Stylizes
				Bonisa.stylize();
			
		    // Configures the framework
		    Bonisa.configEngine();
		    
		});
	};
	
	// Configures the Engine, opening the necessary files
	Bonisa.configEngine = function(){
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
		
		sleep(500).then(() => {
			// Initializes the slide
			Bonisa.wait.style.display = 'none';
			
			switch(Bonisa.engine){
				case 'reveal':
					Reveal.initialize(Bonisa.config);
					break;
				case 'impress':
					impress().init(Bonisa.config);
					break;
			}					 
	 	});
	}
	
	// Creates the slides with the read text
	Bonisa.createSlide = function(content){
		var regexp = '^';
		
		// Get all local links and put them in to absolute paths
		content = relativize(content);
		
		// Turn the delimiter in to regexp
		for(let c in Bonisa.delimiter)
			regexp += '\\u00' + Bonisa.delimiter.charCodeAt(c).toString(16);
		
		regexp = RegExp(regexp, 'gm');
		
		// Split the content by selected marker (default is '---')
		content = content.split(regexp);
		
		// Defines which convert library to use
		switch(Bonisa.fileFormat){
			case 'md':
				Bonisa.convert = marked;
				break;
			case 'adoc':
				Bonisa.convert = asciidoctor.convert; 
				break;
		}
		
		// Converts the text AND creates the slide
		for(let c in content){
			var 
				elm = Bonisa.slide.cloneNode(true);
			
			elm.innerHTML += Bonisa.convert(content[c]);
			Bonisa.slide.parentElement.appendChild(elm);
		}
		
		// Removes an extra element - the original void element
		Bonisa.slide.parentElement.removeChild(Bonisa.slide);
	}
	
	// Creates and configures the structure
	Bonisa.configStructure = function(){
		var
			structure = {
				'.': 'className',
				'#': 'id'
			},
			frameworkStructure;
		
		// Get the structure of the selected framework
		frameworkStructure = Bonisa.structure;
		
		frameworkStructure = frameworkStructure.split(' ');
		
		// Creates the HTML object and configure it's ID or CLASSNAME
		for(let area in frameworkStructure){
			var
				identification = frameworkStructure[area].replace('#', '') != frameworkStructure[area] ? 'id' : 'className',
				element,
				parent;
			
			// Element parent
			parent = frameworkStructure[area].replace(/(\u0023|\u002e)/g, ' ').split(' ');
			
			// Creates the object
			element = document.createElement(parent[0]);
			element[identification] = parent[1] || '';
			
			// Append it
			parent = frameworkStructure[area - 1] || 'body';
			document.querySelector(parent).appendChild(element);
		}
		
		// Defines
		Bonisa.slide = element;
		return element;
	}
	
	// This is showed when everything is still loading
	Bonisa.createWait = function(){
		var wait = document.createElement('div');
		
		wait.innerHTML = Bonisa.wait || "<img src='" + Bonisa.location + "/media/img/loading.gif' style='width:15vw;margin-left:42.5%;margin-top:32.5vh;margin-bottom:2%;'>\n<p style='text-align: center;'>Loading... please, wait...</p>";
		
		wait.style.display = 'inline-block';
		wait.style.visibility = 'visible';
		wait.style.width = '100vw';
		wait.style.height = '100vh';
		
		document.body.appendChild(wait);
		
		Bonisa.wait = wait;
	}
	
	// Error message
	Bonisa.error = function(){
		 console.log("%cYou've got an error message, don't you? If you did, read this: ", "color: #44d; font-weight: bold; font-size: 1.5em;");
		
		console.log("%cHouston, we've got a problem...\n\n%cIt's kind of... impossible to create a presentation without a text file. To configure it do this:\n\n%cBonisa.init({\n\tfile: 'yourFileName.extension',\n\tdir: 'file/directory/location',\n\tengine: 'engine-name'\n});", "color: #111; text-transform: uppercase; font-size: 1.25em; font-weight: bold;", "color: #111;", "color: #44f; font-family: monospace; padding: 2%;");

		alert("ERROR: No input file was selected to create the presentation. Open DevTools (F12) to more details ;)");
	}
	
	// Loads the requested and obligatory dependencies
	Bonisa.loadDependencies = function(){
		var
		  dependencies = [],
		  formats = {
		    'md': 'marked',
		    'adoc': 'asciidoctor'
		  };
		
		// Check if it is an Array
		Bonisa.dependencies = Array.isArray(Bonisa.dependencies) ?
			Bonisa.dependencies.push(formats[Bonisa.fileFormat]) :
		    [formats[Bonisa.fileFormat]];
		
		// Opens each dependecie
		for(let dep in Bonisa.dependencies){
			var lib = document.createElement('script');
			lib.src = Bonisa.location + '/libs/' + Bonisa.dependencies + '/' +  Bonisa.dependencies + '.min.js';
			document.head.appendChild(lib);
		}
	}
	
	// Teaches the computer how to make a pancake...
	Bonisa.openFiles = function(){
		var 
			file = Array.isArray(Bonisa.file) ? Bonisa.file : [Bonisa.file];
		
		// Opens each file
		for(let f in file){
			openFile(
				Bonisa.dir + file,
				file[f].split('.')[file[f].split('.').length - 1],
				Bonisa.callback
			);
		}
	}
	
	// Apply the selected styles
	Bonisa.stylize = function(){
		// Opens all styles
		for(let style in Bonisa.styles){
			var link = document.createElement('link');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.href = Bonisa.styles[style];
		}
	}

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