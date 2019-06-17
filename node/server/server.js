
var express = require('express');
var fs = require('fs');
var app = express();
var { pages } = require('./pages.js');

var logo = fs.readFileSync("../../web/img/logo.svg").toString();
logo = logo.substring(logo.indexOf("?>") + 2).replace('id="Ebene_1"', 'id="mainlogo"');

var fragments = {};

function getNavi(activeName) {
  var navi = "";
  for (const key in pages) {
    if (pages.hasOwnProperty(key)) {
      const page = pages[key];
      if (page.name == activeName)
        navi += '<li><a href="/' + page.name + '.html" class="active">' + page.title + '</a></li>';
      else
        navi += '<li><a href="/' + page.name + '.html">' + page.title + '</a></li>';
    }
  }
  return navi;
}

function getPageOutput(page) {
  const content = fragment(page.name);
  const output = 
      fragment('head')
        .replace("$NAVI", getNavi(page.name))
        .replace("$TITLE", "Queer All Year - " + page.title) 
        .replace("$CARDTITLE", page.cardtitle)
        .replace("$DESCRIPTION", page.description)
    + content 
        .replace("$MAINLOGO", logo)
    + fragment('foot');
  return output;
}

function fragment(name) {
  //if (!fragments[name]) {
    fragments[name] = fs.readFileSync("../../web/contents/" + name + ".fragment").toString();
  //}
  return fragments[name];
}

for (const key in pages) {
  if (pages.hasOwnProperty(key)) {
    const page = pages[key];
    const output = getPageOutput(page)
    app.get('/' + page.name + ".html", function (req, res) {
      res.send(output);
    });
    if(page.name == "index") {
      app.get('/', function (req, res) {
        res.send(output);
      });
    }
  }
}

app.use(express.static('../../web/'));

app.listen(8000, function () {
  console.log('Example app listening on port 8000!');
});


