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
  graphics[newId] = async function () {
    const filepath = resolve("../../web/img/" + filename + ".svg");
    const data = fs.readFileSync(filepath).toString();
    const optimized = await svgo.optimize(data, { path: filepath });
    const onlySvg = optimized.data.substring(optimized.data.indexOf("?>") + 1);
    return onlySvg.replace('id="svgdocument"', 'id="' + newId + '"');
  }();
}

flags.layouts.forEach(layout => {
  readSvg("logo_" + layout + "_shadow", layout);
  gradientsFuture[layout] = initSvg(layout);
});

var fragments = {};

function getNavi(activeName) {
  var navi = "";
  for (const key in pages) {
    if (pages.hasOwnProperty(key)) {
      const page = pages[key];
      if (!page.hidden) {
        var title = page.menutitle || page.title;
        if (page.name == activeName)
          navi += '<li><a href="/' + page.name + '.html" class="active">' + title + '</a></li>';
        else
          navi += '<li><a href="/' + page.name + '.html">' + title + '</a></li>';
      }
    }
  }
  return navi;
}

function flagList() {
  var list = "<option>Eigene Farbkombination</option><option disabled>──────────</option>";
  for (const key in flags.allFlags) {
    if (flags.allFlags.hasOwnProperty(key)) {
      var sel = (key == "Gay") ? " selected='selected'" : "";
      list += '<option ' + sel + '>' + key + '</option>';
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
      .replace("$SHADOW", (await graphics[defaultLogo]).replace(defaultLogo, "shadow"))
      .replace("$MAINLOGO", (await graphics[defaultLogo]).replace(defaultLogo, "mainlogo"))
      .replace("$PREVIEWLOGO", (await graphics[defaultLogo]).replace(defaultLogo, "previewlogo"))
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
  var widthPixel = parseInt(req.query.widthPixel) || 1920;
  var widthMm = parseInt(req.query.widthMm) || 200;
  var background = req.query.background || 'badbff';
  var dither = req.query.dither || '';
  if (background.substring(0, 1) == "#") {
    background = background.substring(1);
  }

  realFormat = type;

  switch (type) {
    case "pdf":
      withshadow = false;
      break;
    case "trans":
      realFormat = "png";
      break;
    case "png":
      break;
    case "shirt":
      realFormat = "png";
      widthPixel = widthMm * 0.039 * 200;
      break;
    case "jpg":
      break;
    case "twitter":
      realFormat = "jpg";
      specialSize = "twitter";
      widthPixel = 1500;
      break;
    case "quad":
      realFormat = "jpg";
      specialSize = "quad";
      widthPixel = 512;
      break;
    case "round":
      realFormat = "jpg";
      specialSize = "round";
      widthPixel = 512;
      break;
    case "svg":
      break;

    default:
      break;
  }

  var prettyFileName = "QueerAllYear_" + layout + "_" 
                                       + flag + "_" 
                                       + "domain" + domain 
                                       + "_w" + widthPixel 
                                       + (withshadow ? "_withshadow" : "") 
                                       + (dither.length > 0 ? "_" + dither : "") 
                                       + "." + realFormat;


  console.log("Building " + prettyFileName);

  var gradients = await gradientsFuture[layout];

  if (!gradients) {
    res.status(500).send("Sorry, das layout " + layout + " existiert nicht.");
    return;
  }

  if (flag == "Eigene Farbkombination") {
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
  } else if (realFormat == "pdf" || realFormat == "png" || realFormat == "jpg") {
    try {
      const filenameBase = resolve("tmp/tmp" + Math.random().toString());
      fs.writeFileSync(filenameBase + ".svg", gradients.svgString());
      const inkscape = process.env.inkscape || "inkscape";

      extraParams = "";
      typeForInksacpe = realFormat;

      if (realFormat == "png" || realFormat == "jpg") {
        if (widthPixel > 4096) {
          res.status(500).send("Sorry, größer als 4096 ist nicht erlaubt.");
          return;
        }
        if (realFormat == "jpg" || type == "png") { // type == png implies non-transparent
          extraParams = " --export-width=" + widthPixel + " --export-background-opacity=1 --export-background=#" + background + " ";
          typeForInksacpe = "png";
        } else {
          extraParams = " --export-width=" + widthPixel + " --export-background-opacity=0 ";
        }
      }

      const command = inkscape + " " + filenameBase + '.svg --export-' + typeForInksacpe + '=' + filenameBase + "." + typeForInksacpe + extraParams;
      console.log("Executung: " + command);
      const { stdout, stderr } = await exec(command);

      if (realFormat == "jpg") {
        var resize = "";
        if (type == "twitter") {
          resize = " -bordercolor '#" + background + "' -border 5%x15% -resize 1500x500\\> -size 1500x500 xc:'#" + background + "' +swap -gravity center -composite ";
        }
        if (type == "quad") {
          resize = " -bordercolor '#" + background + "' -border 2%x2% -resize 512x512\\> -size 512x512 xc:'#" + background + "' +swap -gravity center -composite ";
        }
        if (type == "round") {
          resize = " -bordercolor '#" + background + "' -border 15%x15% -resize 512x512\\> -size 512x512 xc:'#" + background + "' +swap -gravity center -composite ";
        }

        const command = "convert " + filenameBase + ".png " + resize + filenameBase + ".jpg";
        console.log("Executung: " + command);
        const { stdout, stderr } = await exec(command);
      }

      if (type == "shirt" && dither && dither.length > 0 && withshadow) {
        const command = "convert " + filenameBase + ".png -channel A -ordered-dither " + dither + " " + filenameBase + ".png";
        console.log("Executung: " + command);
        const { stdout, stderr } = await exec(command);
      }

      if (realFormat == "pdf") res.setHeader('Content-Type', 'application/pdf');
      if (realFormat == "png") res.setHeader('Content-Type', 'image/png');
      if (realFormat == "jpg") res.setHeader('Content-Type', 'image/jpeg');
      if (realFormat == "svg") res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Content-Disposition', 'attachment; filename="' + prettyFileName + '"');
      res.sendFile(filenameBase + "." + realFormat);
    } catch (e) {
      res.status(500).send("Sorry, Fehler beim Erstellen der " + realFormat + "-Datei! " + e.toString());
    }
  } else {
    res.status(500).send("Sorry, " + type + " ist kein gültiges Format.");
  }
});

app.listen(8000, function () {
  console.log('Example app listening on port 8000!');
});
