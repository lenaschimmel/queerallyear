
var express = require('express');
var fs = require('fs');
var app = express();
var { pages } = require('./pages.js');
const GradientSvg = require('../tool/recolor.js');
const flags = require('../tool/flags.js');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const resolve = require('path').resolve;

const logo = fs.readFileSync("../../web/img/logo.svg").toString();
const logo_with_shadow = fs.readFileSync("../../web/img/logo_with_shadow.svg").toString();
const mainlogo = logo.substring(logo.indexOf("?>") + 2).replace('id="Ebene_1"', 'id="mainlogo"');
const smalllogo = logo_with_shadow.substring(logo.indexOf("?>") + 2).replace('id="Ebene_1"', 'id="smalllogo"');

var fragments = {};

function getNavi(activeName) {
  var navi = "";
  for (const key in pages) {
    if (pages.hasOwnProperty(key)) {
      const page = pages[key];
      if(!page.hidden) {
        if (page.name == activeName)
          navi += '<li><a href="/' + page.name + '.html" class="active">' + page.title + '</a></li>';
        else
          navi += '<li><a href="/' + page.name + '.html">' + page.title + '</a></li>';
      }
    }
  }
  return navi;
}

function flagList() {
  var list = "";
  for (const key in flags.allFlags) {
    if (flags.allFlags.hasOwnProperty(key)) {
      list += '<option>' + key + '</option>';
    }
  }
  return list;
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
        .replace("$MAINLOGO", mainlogo)
        .replace("$SMALLLOGO", smalllogo)
        .replace("$FLAGS", flagList())
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

async function initSvg(withshadow) {
  dom = "";
  if(withshadow)
    dom = await JSDOM.fromFile("../../web/img/logo_with_shadow.svg", {} );
  else
    dom = await JSDOM.fromFile("../../web/img/logo.svg", {} );
  var doc = dom.window.document;
  //var gradients = dom.window.document.querySelector("defs");
  var defs = doc.getElementsByTagName("defs").item(0);
  return new GradientSvg(defs);
}

//gradientsFutureWithShadow = initSvg(true);
gradientsFuture = initSvg(false);

app.get('/design/download', async function (req, res) {
  var flag = req.query.flag;
  var type = req.query.type;
  // var withshadow = req.query.type;
  var width = parseInt(req.query.width) || 1920;

  console.log("Building " + flag + ", " + type);
  
  //var gradients = withshadow ? (await gradientsFutureWithShadow) : (await gradientsFuture);
  var gradients = await gradientsFuture;
  gradients.changeGradients(flags.allFlags[flag]);
  var start = '<!--?xml version="1.0" encoding="UTF-8" standalone="no"?--><html><head></head><body>';
  var end = '</body></html>';

  if(type == "svg") {
    res.send(dom.serialize().replace(start, "").replace(end, ""));
  } else if(type == "pdf" || type == "png" || type == "jpg") {
    try {
      const filenameBase = resolve("tmp/tmp" + Math.random().toString());
      fs.writeFileSync(filenameBase + ".svg", dom.serialize().replace(start, "").replace(end, ""));
      const inkscape = process.env.inkscape || "inkscape";

      extraParams = "";
      typeForInksacpe = type;

      if(type == "png" || type == "jpg" ) {
        if(width > 4096) {
          res.status(500).send("Sorry, größer als 4096 ist nicht erlaubt.");
          return;
        }
        if(type == "jpg") {
          extraParams = " --export-width=" + width +  " --export-background-opacity=1 --export-background=#badbff ";
          typeForInksacpe = "png";
        } else {
          extraParams = " --export-width=" + width +  " --export-background-opacity=0 ";
        }
      }
      
      const command = inkscape + " " + filenameBase + '.svg --export-'+typeForInksacpe+'=' + filenameBase + "." + typeForInksacpe + extraParams;
      console.log("Executung: " + command);
      const { stdout, stderr } = await exec(command);

      if(type == "jpg") {
        const command ="convert " + filenameBase + ".png " + filenameBase + ".jpg";
        console.log("Executung: " + command);
        const { stdout, stderr } = await exec(command);
      }

      res.sendFile(filenameBase + "." + type);
    } catch(e) {
      res.status(500).send("Sorry, Fehler beim Erstellen der "+type+"-Datei! " + e.toString());
    }
  } else {
    res.status(500).send("Sorry, " + type + " ist kein gültiges Format.");
  }
});

app.listen(8000, function () {
  console.log('Example app listening on port 8000!');
});