var util = require('util');
var color = require('color');

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
 }

var method = GradientSvg.prototype;

function GradientSvg(svgElement, document, dom) {
    this.svgElement = svgElement;
    this.document = document;
    this.dom = dom;
    const svgId = svgElement.getAttribute("id");
    this.defs = svgElement;
    this.mainGroup = document.querySelectorAll("#" + svgId + " #mainGroup").item(0);
    this.domainBold = document.querySelectorAll("#wordDE").item(0);
    this.domainLight = document.querySelectorAll("#wordDEthin").item(0);
    this.finalComposite = document.querySelectorAll("#" + svgId + " #finalComposite").item(0);
    this.rangesL = {};
    this.rangesS = {};

    this.composedRangesL = {};
    this.composedRangesS = {};

    this.originalColors = {};

    for (let i = 0; i < this.defs.children.length; i++) {
        const gradient = this.defs.children.item(i);
        var id = gradient.id;
        if (id.length == 3) {
            var letter = id.substring(0,2);
            var stops = gradient.children;

            this.originalColors[id] = {};
            for (let s = 0; s < stops.length; s++) {
                var stop = stops.item(s);
                this.originalColors[id][s] = color(stop.getAttribute("stop-color"));
            }
            
            if(!this.rangesL[letter]) 
                this.rangesL[letter] = [];
            if(!this.rangesS[letter]) 
                this.rangesS[letter] = [];
            
            this.rangesL[letter].push(getLightnessRange(stops));
            this.rangesS[letter].push(getSaturationRange(stops));
        }
    }

    for (const letter in this.rangesL) {
        if (this.rangesL.hasOwnProperty(letter)) {
            const letterRanges = this.rangesL[letter];
            this.composedRangesL[letter] = composeRanges(letterRanges);
        }
    }

    for (const letter in this.rangesS) {
        if (this.rangesS.hasOwnProperty(letter)) {
            const letterRanges = this.rangesS[letter];
            this.composedRangesS[letter] = composeRanges(letterRanges);
        }
    }
}

method.svgString = function() {
    const start = '<html><head></head><body>';
    const end = '</body></html>';
    return this.dom.serialize().replace(start, "").replace(end, "");
}

method.changeGradients = async function(flag, animate = false) {
    indices = [];
    for (let i = 0; i < this.defs.children.length; i++) {
        indices[i] = i;
    }
    shuffleArray(indices);

    for (let i = 0; i < this.defs.children.length; i++) {
        const gradient = this.defs.children.item(indices[i]);
        var id = gradient.id;
        if (id.length == 3) {
            var letter = id.substring(0,2);
            this.colorLetterGradient(gradient, flag[letter], animate);
        if(animate)
              await sleep(20); // time per gradient
        }
    }
}

method.colorLetter = async function(letterToColor, targetColor, animate = false) {
    for (let i = 0; i < this.defs.children.length; i++) {
        const gradient = this.defs.children.item(i);
        var id = gradient.id;
        if (id.length == 3) {
            var letter = id.substring(0,2);
            if(letter == letterToColor) {
              this.colorLetterGradient(gradient, targetColor, animate);
            }
        if(animate)
                await sleep(20); // time per gradient
        }
    }
}

// IDEA:
// - Use only one source file per Layout, which contains the shadow
// - Create version without shadow by removing the "style" attribute from the element "mainGroup"
// - Create version with only shadow by changing the "operator" attribute of the element "finalComposite" to "destination"
// - find a better way to set IDs for the inlined SVG
method.setShadowMode = function(mode) {
    if(mode == "on") {
        this.mainGroup.setAttribute("filter", "url(#filterShadow)");
        this.finalComposite.setAttribute("operator", "over");
    }
    if(mode == "off") {
        this.mainGroup.setAttribute("filter", "");
    }
    if(mode == "only") {
        this.mainGroup.setAttribute("filter", "url(#filterShadow)");
        this.finalComposite.setAttribute("operator", "arithmetic");
    }
}

method.colorLetterGradient = async function(gradient, targetColor, animate = false) {
    var id = gradient.id;
    var letter = id.substring(0,2);
    var [th, ts, tl] = color(targetColor).hsl().color;
    var stops = gradient.children;
    var diffLightness = adaptRange(this.composedRangesL[letter], tl);
    var diffSaturation = adaptRange(this.composedRangesS[letter], 75);
    
    for (let s = 0; s < stops.length; s++) {
        if(animate)
            await sleep(55); // time per stop
        var stop = stops.item(s);
        var stopcolor = this.originalColors[id][s];

        var [sh, ss, sl] = stopcolor.hsl().color;

        var nh = th;
        var ns = ts; //(ss - diffSaturation) * 1.15 * ts / 100;
        var nl = tl - (tl - sl) * 1.4 * (0.75 - tl * 0.0055) * (0.75 - (100 - tl) * 0.0035);
        if(nl < 0) nl = 0;
        if(nl > 100) nl = 100;
        

        var newColor = color.hsl([nh, ns, nl]).hex()
        stop.setAttribute("stop-color", newColor);
    }
}

method.setDomainMode = function(mode) {
    if(this.domainBold)  this.domainBold.setAttribute("style", (mode == "bold") ? "" : "display: none;");
    if(this.domainLight) this.domainLight.setAttribute("style", (mode == "light") ? "" : "display: none;");
}

function composeRanges(rangeArray) {
    var min, max;
    for (const key in rangeArray) {
        if (rangeArray.hasOwnProperty(key)) {
            const range = rangeArray[key];
            
            min = min ? Math.min(min, range.min) : range.min;
            max = max ? Math.max(max, range.max) : range.max;
        }
    }
    return {
        "min": min,
        "max": max,
        "mid": (min + max) / 2,
        "width": max - min
    };
}

function adaptRange(range, target) {
    return range.mid - target;
}

function getLightnessRange(stops) {
    return getRange(stops, 2);
}

function getSaturationRange(stops) {
    return getRange(stops, 1);
}

function getRange(stops, index) {
    var min, max;
    for (let s = 0; s < stops.length; s++) {
        var stop = stops.item(s);
        var stopcolor = color(stop.getAttribute("stop-color"));

        var hsl = stopcolor.hsl().color;
        min = min ? Math.min(min, hsl[index]) : hsl[index];
        max = max ? Math.max(max, hsl[index]) : hsl[index];
        
    }
    return {
        "min": min,
        "max": max,
        "mid": (min + max) / 2,
        "width": max - min
    };
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

module.exports = GradientSvg;