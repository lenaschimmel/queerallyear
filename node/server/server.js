
var express = require('express');
var fs = require('fs');
var app = express();


var index = fs.readFileSync("../../web/index.html").toString();
var logo  = fs.readFileSync("../../web/img/logo.svg").toString();
var output = index.replace('<img id="mainlogo" src="img/logo.svg" alt="Queer all year">', logo);

app.get('/', function (req, res) {
  res.send(output);
});

app.use(express.static('../../web/'));

app.listen(8000, function () {
  console.log('Example app listening on port 8000!');
});


