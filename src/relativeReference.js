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
			console.log(newLink);

			rtr = rtr.replace(link, newLink);
		}
	}
	
	return rtr;
}