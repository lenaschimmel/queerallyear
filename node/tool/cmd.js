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
        fs.writeFileSync("../output.svg", dom.serialize());
    });
}

processSvgFile();