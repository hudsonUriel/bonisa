/*
  * Script utilizado para criar um servidor NODEJS
  * utilizando Express e incluindo arquivos estáticos
*/

// Definições globais
var
  express = require('express'),
  app = express()
;

const
  port = 8086,
  DIRNAME = __dirname.split('\\').slice(0, -1).join('\\');

// Adiciona os arquivos estáticos ao servidor como caminho virtuais
app.use('/src', express.static(DIRNAME + '/src'));

// Cria a rota padrão
app.get('/', function(req, res){
  res.sendFile(DIRNAME + '/test/index.html');
})

// Inicia o servidor
app.listen(port, function(){
  console.log('Servidor rodando em 127.0.0.1:' + port);
});