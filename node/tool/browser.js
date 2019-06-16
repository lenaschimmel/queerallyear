const recolor = require('./recolor.js');
const flags = require('./flags.js');
const util = require('util');

var gradients = window.document.getElementsByTagName("defs").item(0);
recolor.prepareGradients(gradients);

window.showflag = function(flagname) {
    recolor.changeGradients(gradients, flags[flagname]);
}

function nextFlag() {
    var keys = Object.keys(flags.allFlags)
    flagName = keys[ keys.length * Math.random() << 0];
    console.log("flagName: " + util.inspect(flagName));
    recolor.changeGradients(gradients, flags.allFlags[flagName]);
}

setInterval(nextFlag, 2500);