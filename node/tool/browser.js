const recolor = require('./recolor.js');
const flags = require('./flags.js');

var gradients = window.document.getElementsByTagName("defs").item(0);
recolor.prepareGradients(gradients);

window.showflag = function(flagname) {
    recolor.changeGradients(gradients, flags[flagname]);
}