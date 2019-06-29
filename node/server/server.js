var express = require('express');
var fs = require('fs');
var app = express();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const resolve = require('path').resolve;
const SVGO = require('svgo');

var { pages } = require('./pages.js');
const GradientSvg = require('../tool/recolor.js');
const flags = require('../tool/flags.js');

const enabledPlugins = [
  "cleanupAttrs", "removeDoctype", "removeXMLProcInst", "removeComments", "removeMetadata", "removeTitle", "removeDesc", 
  "removeUselessDefs", "removeEditorsNSData", "removeEmptyAttrs", "removeHiddenElems", "removeEmptyText", 
  "removeEmptyContainers", "cleanupEnableBackground", "convertStyleToAttrs", "convertColors", 
  "convertTransform", "removeUnknownsAndDefaults", "removeNonInheritableGroupAttrs", "removeUselessStrokeAndFill", 
  "removeUnusedNS", "cleanupNumericValues", "moveElemsAttrsToGroup", "moveGroupAttrsToElems", "collapseGroups", "mergePaths", 
  "sortAttrs", "removeDimensions"
];

const disabledPlugins = ["removeViewBox", "cleanupIDs", "removeRasterImages", "convertPathData", "convertShapeToPath"];

function createPluginsArray(enabled, disabled) {
  var array = [];
  enabled.forEach(plugin => {
    array.push({ [plugin]: true });
  });
  disabled.forEach(plugin => {
    array.push({ [plugin]: false });
  });
  return array;
}

const svgo = new SVGO({
  pretty: true,
  floatPrecision: 4,
  plugins: createPluginsArray(enabledPlugins, disabledPlugins)
});

const graphics = {};
gradientsFuture = {};

async function readSvg(filename, newId) {
  graphics[newId] = async function() {
    const filepath = resolve("../../web/img/" + filename + ".svg");
    const data = fs.readFileSync(filepath).toString();
    const optimized = await svgo.optimize(data, { path: filepath });
    const onlySvg = optimized.data.substring(optimized.data.indexOf("?>") + 1);
    return onlySvg.replace('id="svgdocument"', 'id="' + newId + '"');
  }();
}

flags.layouts.forEach(layout => {
  readSvg("logo_"+layout+"_shadow", layout);
  gradientsFuture[layout] = initSvg(layout);
});

var fragments = {};

function getNavi(activeName) {
  var navi = "";
  for (const key in pages) {
    if (pages.hasOwnProperty(key)) {
      const page = pages[key];
      if (!page.hidden) {
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
  var list = "<option>Eigene Farbkombination</option>";
  for (const key in flags.allFlags) {
    if (flags.allFlags.hasOwnProperty(key)) {
      list += '<option>' + key + '</option>';
    }
  }
  return list;
}

async function getPageOutput(page) {
  const defaultLogo = "orig2";
  const content = fragment(page.name);
  const output =
    fragment('head')
      .replace("$NAVI", getNavi(page.name))
      .replace("$TITLE", "Queer All Year - " + page.title)
      .replace("$CARDTITLE", page.cardtitle)
      .replace("$DESCRIPTION", page.description)
    + content
      .replace("$SHADOW", (await graphics[defaultLogo]).replace(defaultLogo,"shadow"))
      .replace("$MAINLOGO", (await graphics[defaultLogo]).replace(defaultLogo,"mainlogo"))
      .replace("$PREVIEWLOGO", (await graphics[defaultLogo]).replace(defaultLogo,"previewlogo"))
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
    app.get('/' + page.name + ".html", async function (req, res) {
      res.send(await output);
    });
    if (page.name == "index") {
      app.get('/', async function (req, res) {
        res.send(await output);
      });
    }
  }
}

app.use(express.static('../../web/'));

async function initSvg(svgId) {
  const source = await graphics[svgId];
  const dom = new JSDOM(source);
  return new GradientSvg(dom.window.document.getElementById(svgId), dom.window.document, dom);
}

app.get('/img/shadow/:layout.svg', async function (req, res) {
  var gradients = await gradientsFuture[req.params.layout];
  gradients.setShadowMode("only");
  gradients.setDomainMode("off");
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(gradients.svgString());
});

app.get('/design/download', async function (req, res) {
  var flag = req.query.flag;
  var type = req.query.type;
  var withshadow = req.query.withshadow;
  var layout = req.query.layout;
  var domain = req.query.domain;
  var width = parseInt(req.query.width) || 1920;

  if (type == "pdf" && withshadow) {
    res.status(500).send("Sorry, pdf-Ausgabe funktioniert derzeit nicht mit aktivierten Schatten.");
    return;
  }

  var prettyFileName = "QueerAllYear_" + layout + "_" + flag + "_domain" + domain + "_w" + width + (withshadow ? "_withshadow" : "") + "." + type;


  console.log("Building " + flag + ", " + type + ", withShadow: " + withshadow + ", domain: " + domain);

  var gradients = await gradientsFuture[layout];

  if(!gradients) {
    res.status(500).send("Sorry, das layout " + layout + " existiert nicht.");
    return;
  }

  if(flag == "Eigene Farbkombination") {
    flags.letters.forEach(letter => {
      var color = "#" + (req.query[letter] || "FFFFFF");
      gradients.colorLetter(letter, color, false);
    });
  } else {
    const colormap = flags.flagmap(flags.linesInDesign(layout), flags.allFlags[flag], flag, domain == "bold");
    gradients.changeGradients(colormap);
  }
  gradients.setShadowMode(withshadow ? "on" : "off");
  gradients.setDomainMode(domain);

  if (type == "svg") {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Content-Disposition', 'attachment; filename="' + prettyFileName + '"');
    res.send(gradients.svgString());
  } else if (type == "pdf" || type == "png" || type == "jpg") {
    try {
      const filenameBase = resolve("tmp/tmp" + Math.random().toString());
      fs.writeFileSync(filenameBase + ".svg", gradients.svgString());
      const inkscape = process.env.inkscape || "inkscape";

      extraParams = "";
      typeForInksacpe = type;

      if (type == "png" || type == "jpg") {
        if (width > 4096) {
          res.status(500).send("Sorry, größer als 4096 ist nicht erlaubt.");
          return;
        }
        if (type == "jpg") {
          extraParams = " --export-width=" + width + " --export-background-opacity=1 --export-background=#badbff ";
          typeForInksacpe = "png";
        } else {
          extraParams = " --export-width=" + width + " --export-background-opacity=0 ";
        }
      }

      const command = inkscape + " " + filenameBase + '.svg --export-' + typeForInksacpe + '=' + filenameBase + "." + typeForInksacpe + extraParams;
      console.log("Executung: " + command);
      const { stdout, stderr } = await exec(command);

      if (type == "jpg") {
        const command = "convert " + filenameBase + ".png " + filenameBase + ".jpg";
        console.log("Executung: " + command);
        const { stdout, stderr } = await exec(command);
      }
      if (type == "pdf") res.setHeader('Content-Type', 'application/pdf');
      if (type == "png") res.setHeader('Content-Type', 'image/png');
      if (type == "jpg") res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Content-Disposition', 'attachment; filename="' + prettyFileName + '"');
      res.sendFile(filenameBase + "." + type);
    } catch (e) {
      res.status(500).send("Sorry, Fehler beim Erstellen der " + type + "-Datei! " + e.toString());
    }
  } else {
    res.status(500).send("Sorry, " + type + " ist kein gültiges Format.");
  }
});

app.listen(8000, function () {
  console.log('Example app listening on port 8000!');
});
