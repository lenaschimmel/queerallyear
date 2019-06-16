const recolor = require('./recolor.js');
const flags = require('./flags.js');

var gradients = window.document.getElementsByTagName("defs").item(0);
recolor.processGradients(gradients, flags.ace);

window.showflag = function(flagname) {
    recolor.processGradients(gradients, flags[flagname]);
}