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
		externalLink = /(\u002ecom|\u002egov|\u002enet)/g;
	
	rtr = string;
	
	string = string.split(/(\u0028|\u0029|\u005b|\u005d| +)/g);
	
	// Search for link
	for(let str in string){
		if(regex.test(string[[str]])){
			link = string[str];
			
			if(!externalLink.test(link)){
				console.log(link.replace(/\u002e+\u002f/g, ""));
			}
		}
	}
	
	return rtr;
}