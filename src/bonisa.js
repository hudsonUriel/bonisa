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
	
	// Sleep function
	const sleep = (milliseconds) => {
		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}
	
	Bonisa.init = function(configs){
		// Normalizes the input
		configs = typeof configs == 'object' ? configs : {configs};
		
		// Get the basic properties
		var
			file,
			dir,
			engine,
			callback,
			wait;
		
		file = configs.file || null;
		dir = configs.dir || './';
		engine = configs.engine || configs.framework || configs.tool || 'reveal';
		callback = configs.callback || Bonisa.createSlide;
		wait = configs.wait;
		
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
		
		// Make sure that a valid engine is selected
		Bonisa.engine = Bonisa.engines.hasOwnProperty(engine) ? engine : 'reveal';
		Bonisa.callback = callback;
		
		// Get the dependencies
		Bonisa.dependencies = configs.dependencies;
		
		// Creats the wait page
		Bonisa.createWait();
		
		// Load the necessary libraries/dependencies
		Bonisa.loadDependencies();
		
		// Waits a little time until everything is ok...
		sleep(500).then(() => {
		    // Creates the framework structure
		    Bonisa.configStructure();
		
		    // Configures the framework
		    Bonisa.configEngine();
		
		    // Opens the file(s)
		    Bonisa.openFiles();
		});
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
	
	Bonisa.configStructure = function(){
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
					Reveal.initialize();
					break;
				case 'impress':
					impress().init();
					break;
			}					 
	 	});
	}
	
	Bonisa.createSlide = function(content){
		content = relativize(content);
		
		content = content.split('---');

		for(let c in content){
			var 
				elm = Bonisa.slide.cloneNode(true);

			elm.innerHTML += marked(content[c]);
			Bonisa.slide.parentElement.appendChild(elm);
		}

		Bonisa.slide.parentElement.removeChild(Bonisa.slide);
	}
	
	Bonisa.createWait = function(){
		var wait = document.createElement('div');
		
		wait.innerHTML = Bonisa.wait || "<img src='" + Bonisa.location + "../media/img/loading.gif' style='width:15vw;margin-left:42.5%;margin-top:32.5vh;margin-bottom:2%;'>\n<p style='text-align: center;'>Loading... please, wait...</p>";
		
		wait.style.display = 'inline-block';
		wait.style.visibility = 'visible';
		wait.style.width = '100vw';
		wait.style.height = '100vh';
		
		document.body.appendChild(wait);
		
		Bonisa.wait = wait;
	}

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
	
	return Bonisa;
}());