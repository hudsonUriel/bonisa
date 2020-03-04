/*
  * NODEJS/Express HTTP Server
*/
const
  port = 8086,
  
  // The splitter is used to generate the correct path name
    // eg. Linux   --> /home/myUser/Documents
    // eg. Windows --> C:\Users\myUser\Documents --> \ is a special JS char
  splitter = __dirname.split('\\') == __dirname ? '/' : '\\';
  DIRNAME = __dirname.split(splitter).slice(0, -1).join(splitter);

// Global definitions
var
  express     = require('express'),
  app         = express(),
  config      = require('./config.json'),
  reader      = require('./fileReader.js'),
  fileResponse = null,
  fs          = require('fs')
;

// Read all files
fileResponse = reader.fileReader.init();
fileResponse.readFiles(config.textFiles);

// Creates a new html file
fs.writeFile(
  // File name
  DIRNAME + splitter + config.outputFile,
  // File content
  "<script src='../src/bonisaNode.js'></script>\n<script>\nwindow.onload = function(){\nBonisa.init({\n\tcontent: " + 
  "\"" + encodeURI(fileResponse.content) + "\""
  + "\n})};\n</script>",
  // Callback function
  function (err) {
    if (err) throw err;
  }
); 

// Add static files to the server as a virtual path
app.use('/libs', express.static(DIRNAME + '/libs/'));
app.use('/src', express.static(DIRNAME + '/src'));
app.use('/test', express.static(DIRNAME + '/test'));

// Standard express routes
app.get('/', function(req, res){
  res.sendFile(DIRNAME +  splitter + config.outputFile);
})

// Turns on the server
app.listen(port, function(){
  console.log('Server running in 127.0.0.1:' + port);
});