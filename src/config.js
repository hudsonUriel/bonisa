/*
  * NODEJS/Express HTTP Server
*/

// Global definitions
var
  express = require('express'),
  app = express()
;

const
  port = 8086,
  
  // The splitter is used to generate the correct path name
    // eg. Linux   --> /home/myUser/Documents
    // eg. Windows --> C:\Users\myUser\Documents --> \ is a special JS char
  splitter = __dirname.split('\\') == __dirname ? '/' : '\\';
  DIRNAME = __dirname.split(splitter).slice(0, -1).join(splitter);

// Add static files to the server as a virtual path
app.use('/libs', express.static(DIRNAME + '/libs/'));
app.use('/src', express.static(DIRNAME + '/src'));

// Standard express routes
app.get('/', function(req, res){
  res.sendFile(DIRNAME + '/test/index.html');
})

// Turns on the server
app.listen(port, function(){
  console.log('Servidor rodando em 127.0.0.1:' + port);
});