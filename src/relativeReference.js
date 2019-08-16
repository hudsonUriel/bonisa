function relativeReference(reference){
	return getReferences(reference);
}

function getReferences(string){
	var 
		string ,
			
		link,
		curLocation = window.location,
		rtr,
			
		regex = /(\u002e+|\D+|\d+)\u002F/g,
		externalLink = /(\u002ecom|\u002egov|\u002enet)/g,
		hName = curLocation.hostname,
		pName = curLocation.pathname.replace('/','').split('/')[0];
	
	rtr = string;
	
	string = string.split(/(\u0028|\u0029|\u005b|\u005d| +)/g);
	
	// Search for link
	for(let str in string){
		if(regex.test(string[[str]])){
			link = string[str];
			
			if(!externalLink.test(link)){
				var
					newLink = curLocation.protocol + '//' + hName + '/' + pName + '/' +link.replace(/\u002e+\u002f/g, "");
				
				rtr = rtr.replace(link, newLink);
			}
		}
	}
	
	return rtr;
}