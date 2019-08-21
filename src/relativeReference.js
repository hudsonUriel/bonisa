function relativize(content){
	/*
	* Links are structure that:
	*
	* ^(\w{1,}\u003A\u002F{2}|(\w{1,}|\u002E{1,2})(\u002F|\u002E)){1,}(\w{1,}|\w{1,}\u002F|\w{1,}\W{1,}\w{1,}\u002E\w{1,})$
	*
	* ---
	* 1. Begins with either:
	*	a. protocol://
	* b. ./
	* c. ../
	* d. folder/
	* e. site.
	*
	* REGEX: ^(\w{1,}\u003A\u002F{2}|(\w{1,}|\u002E{1,2})(\u002F|\u002E))
	*
	* ---
	* 2. Any of the itens of 1 can be repeated multiple times
	* a. protocol://site.site.com
	* b. ./folder/folder2/file.png
	* c. folder/folder2/file.png
	* d. site.com.br
	*
	* REGEX: ^(\w{1,}\u003A\u002F{2}|(\w{1,}|\u002E{1,2})(\u002F|\u002E)){1,}
	*
	* ---
	*3. Ends with:
	* a. word
	* b file.format
	* c. file-name.format
	* d. word/
	* e. file.format/
	*
	* REGEX: (\w{1,}|\w{1,}\u002F|\w{1,}\W{1,}\w{1,}\u002E\w{1,})$
	*/
	var 
		content ,
			
		link,
		curLocation = window.location,
		rtr,
	
		regex = /^(\w{1,}\u003A\u002F{2}|(\w{1,}|\u002E{1,2})(\u002F|\u002E)){1,}(\w{1,}|\w{1,}\u002F|\w{1,}\W{1,}\w{1,}\u002E\w{1,})$/gm,
		validLink = /\u002E(com|gov|org|net|info|io)/g,
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
			
			// Tests if it is not an external link
			if(!validLink.test(link)){
				
				var
					newLink = Bonisa.location + '/' + link.replace(/\u002E+\u002F/g, "");
				console.log(newLink);
				
				rtr = rtr.replace(link, newLink);
			}
		}
	}
	
	return rtr;
}