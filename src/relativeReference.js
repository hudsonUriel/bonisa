function relativize(content){
	var 
		content ,
			
		link,
		curLocation = window.location,
		rtr,
			
		regex = /(\u002e+|\D+|\d+)\u002F/g,
		externalLink = /(\u002ecom|\u002egov|\u002enet)/g,
		hName = curLocation.hostname,
		pName = curLocation.pathname.replace('/','').split('/')[0];
	
	rtr = content;
	
	// Split each [Link Reference](link/here) element found in the content
	content = content.split(/(\u0028|\u0029|\u005b|\u005d| +)/g);
	
	// Search for links
	for(let str in content){
		// Test if it is a link
		if(regex.test(content[[str]])){
			link = content[str];
			
			// Tests if it is not an external link
			if(!externalLink.test(link)){
				var
					newLink = curLocation.protocol + '//' + hName + '/' + pName + '/' +link.replace(/\u002e+\u002f/g, "");
				
				rtr = rtr.replace(link, newLink);
			}
		}
	}
	
	return rtr;
}