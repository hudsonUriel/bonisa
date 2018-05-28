/*!
 * bonisa.js
 * AGPL-3.0 licensed
 *
 * 
 * --> this file contains the AJAX configurations
 *     to use GOALS.md file as HTML
 */

window.onload = function(){
    // using AJAX to open GOALS.md
        // new XMLHttpRequest object
        var fileRequest = new XMLHttpRequest();

        // opening file
        fileRequest.open('GET', './GOALS.md');

        // when state changes
        fileRequest.onreadystatechange = function(){
            // if the Server responds
            if(fileRequest.readyState == 4){
                // creates HTML main list (ol) and appends
                mainList = document.createElement('ol');
                document.getElementById('wrapper').appendChild(mainList);

                // get the response text and configures it
                goals = fileRequest.responseText;
                goals = goals.split('*');

                // creates the list
                goals.forEach(function(li){
                    value = li.split(']')[1];
                    cls = li.split(']')[0].replace('[', '');

                    // if value is not null
                    if(value){
                        // cretes te the current item (li)
                        item = document.createElement('li');
                        
                        // configures item class
                        item.className = 'normalItem';
                        
                        // creates the span and appends it
                        span = document.createElement('span');
                        span.className = 'goal-' + cls.toString().replace(' ', '').toLocaleLowerCase();
                        
                        // put the text in span
                        if(span.className == 'goal-ok'){span.innerHTML = '&#10003;';}
                        else if(span.className == 'goal-progress'){span.innerHTML = '&#8722;';}
                        else if(span.className == 'goal-future'){span.innerHTML = '&#128473;';}
                        else if(span.className == 'goal-master'){span.innerHTML = '...';item.className = 'masterItem';}

                        // innerHTML
                        item.innerHTML = value;
                        item.appendChild(span);

                        // appends
                            // if the text is in UPPERCASE
                            if(value.toString() == value.toLocaleString().toUpperCase()){
                                // appends item in mainList
                                mainList.appendChild(item);

                                // creates new list and appends in item
                                list = document.createElement('ol');
                                item.appendChild(list);
                            } else{
                                list.appendChild(item);
                            }
                    }
                });
            }
        };

    // sends the request
    fileRequest.send();
    
};