var util = require('util');
var color = require('color');

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
 }

var method = GradientSvg.prototype;

function GradientSvg(dom) {
    this.dom = dom;
    this.defs = dom.window.document.getElementsByTagName("defs").item(0);
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
    for (let i = 0; i < this.defs.children.length; i++) {
        const gradient = this.defs.children.item(i);
        var id = gradient.id;
        if (id.length == 3) {
            var letter = id.substring(0,2);
            this.colorLetter(gradient, flag[letter], animate);
        }
        if(animate)
          await sleep(25);
    }
}

method.colorLetter = async function(gradient, targetColor, animate = false) {
    var id = gradient.id;
    var letter = id.substring(0,2);
    var [th, ts, tl] = color(targetColor).hsl().color;
    var stops = gradient.children;
    var diffLightness = adaptRange(this.composedRangesL[letter], tl);
    var diffSaturation = adaptRange(this.composedRangesS[letter], 75);
    
    for (let s = 0; s < stops.length; s++) {
        if(animate)
            await sleep(45);
        var stop = stops.item(s);
        var stopcolor = this.originalColors[id][s];

        var [sh, ss, sl] = stopcolor.hsl().color;

        var nh = th;
        var ns = (ss - diffSaturation) * 1.15 * ts / 100;
        var nl = sl - diffLightness;

        var newColor = color.hsl([nh, ns, nl]).hex()
        stop.setAttribute("stop-color", newColor);
    }
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
    if (target < range.width / 2)
        target = range.width / 2;

    if (target > 100 - range.width / 2)
        target = 100 - range.width / 2;

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

module.exports = GradientSvg;