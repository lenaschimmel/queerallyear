
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
const SVGO = require('svgo');

const enabledPlugins = [
  "cleanupAttrs", "removeDoctype", "removeXMLProcInst", "removeComments", "removeMetadata", "removeTitle", "removeDesc", 
  "removeUselessDefs", "removeEditorsNSData", "removeEmptyAttrs", "removeHiddenElems", "removeEmptyText", 
  "removeEmptyContainers", "cleanupEnableBackground", "convertStyleToAttrs", "convertColors", "convertPathData", 
  "convertTransform", "removeUnknownsAndDefaults", "removeNonInheritableGroupAttrs", "removeUselessStrokeAndFill", 
  "removeUnusedNS", "cleanupNumericValues", "moveElemsAttrsToGroup", "moveGroupAttrsToElems", "collapseGroups", "mergePaths", 
  "convertShapeToPath", "sortAttrs", "removeDimensions"
];

const disabledPlugins = ["removeViewBox", "cleanupIDs", "removeRasterImages"];

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

async function readSvg(filename, newId) {
  const filepath = resolve("../../web/img/" + filename + ".svg");
  const data = fs.readFileSync(filepath).toString();
  const optimized = await svgo.optimize(data, { path: filepath });
  const onlySvg = optimized.data.substring(optimized.data.indexOf("?>") + 1);
  return onlySvg.replace('id="Ebene_1"', 'id="' + newId + '"');
}

const graphics = {
  "mainlogo": readSvg("logo", "mainlogo"),
  "smalllogo": readSvg("logo_with_shadow", "smallogo")
};

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
  var list = "";
  for (const key in flags.allFlags) {
    if (flags.allFlags.hasOwnProperty(key)) {
      list += '<option>' + key + '</option>';
    }
  }
  return list;
}

async function getPageOutput(page) {
  const content = fragment(page.name);
  const output =
    fragment('head')
      .replace("$NAVI", getNavi(page.name))
      .replace("$TITLE", "Queer All Year - " + page.title)
      .replace("$CARDTITLE", page.cardtitle)
      .replace("$DESCRIPTION", page.description)
    + content
      .replace("$MAINLOGO", await graphics['mainlogo'])
      .replace("$SMALLLOGO", await graphics['smalllogo'])
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

async function initSvg(withshadow) {
  const source = await graphics[withshadow ? 'mainlogo' : 'smalllogo'];
  const dom = new JSDOM(source);
  return new GradientSvg(dom);
}

gradientsFutureWithShadow = initSvg(true);
gradientsFuture = initSvg(false);

app.get('/design/download', async function (req, res) {
  var flag = req.query.flag;
  var type = req.query.type;
  var withshadow = req.query.withshadow;
  var width = parseInt(req.query.width) || 1920;

  if (type == "pdf" && withshadow) {
    res.status(500).send("Sorry, pdf-Ausgabe funktioniert derzeit nicht mit aktivierten Schatten.");
    return;
  }

  var prettyFileName = "QueerAllYear_" + flag + "_w" + width + (withshadow ? "_withshadow" : "") + "." + type;


  console.log("Building " + flag + ", " + type + ", withShadow: " + withshadow);

  var gradients = withshadow ? (await gradientsFutureWithShadow) : (await gradientsFuture);
  gradients.changeGradients(flags.allFlags[flag]);

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