const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');

const recolor = require('./recolor.js');
const flags = require('./flags.js');

function processSvgFile() {
    JSDOM.fromFile("../../web/img/logo.svg", {} ).then(dom => {
        var doc = dom.window.document;
        //var gradients = dom.window.document.querySelector("defs");
        var gradients = doc.getElementsByTagName("defs").item(0);
        recolor.prepareGradients(gradients);
        recolor.changeGradients(gradients, flags.pan);
        var start = '<!--?xml version="1.0" encoding="UTF-8" standalone="no"?--><html><head></head><body>';
        var end = '</body></html>';
        fs.writeFileSync("../output.svg", dom.serialize().replace(start, "").replace(end, ""));
    });
}

processSvgFile();