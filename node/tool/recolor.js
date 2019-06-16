var util = require('util');
var color = require('color');

var rangesL = {};
var rangesS = {};

composedRangesL = {};
composedRangesS = {};

// the parameter "gradients" must be the DOM element with tag "defs" from the SVG file.
exports.processGradients = function(gradients, flag) {
    for (let i = 0; i < gradients.children.length; i++) {
        const gradient = gradients.children.item(i);
        var id = gradient.id;
        if (id.length == 3) {
            var letter = id.substring(0,2);
            var stops = gradient.children;
            
            if(!rangesL[letter]) 
                rangesL[letter] = [];
            if(!rangesS[letter]) 
                rangesS[letter] = [];
            
            rangesL[letter].push(getLightnessRange(stops));
            rangesS[letter].push(getSaturationRange(stops));
        }
    }

    for (const letter in rangesL) {
        if (rangesL.hasOwnProperty(letter)) {
            const letterRanges = rangesL[letter];
            composedRangesL[letter] = composeRanges(letterRanges);
        }
    }

    for (const letter in rangesS) {
        if (rangesS.hasOwnProperty(letter)) {
            const letterRanges = rangesS[letter];
            composedRangesS[letter] = composeRanges(letterRanges);
        }
    }

    for (let i = 0; i < gradients.children.length; i++) {
        const gradient = gradients.children.item(i);
        var id = gradient.id;
        if (id.length == 3) {
            var letter = id.substring(0,2);
           
            var targetColor = flag[letter];
            var [th, ts, tl] = color(targetColor).hsl().color;
            var stops = gradient.children;
            var diffLightness = adaptRange(composedRangesL[letter], tl);
            var diffSaturation = adaptRange(composedRangesS[letter], 75);
            
            for (let s = 0; s < stops.length; s++) {
                var stop = stops.item(s);
            
                var stopcolor = color(stop.getAttribute("stop-color"));

                var [sh, ss, sl] = stopcolor.hsl().color;

                var nh = th;
                var ns = (ss - diffSaturation) * ts / 100;
                var nl = sl - diffLightness;

                var newColor = color.hsl([nh, ns, nl]).hex()
                stop.setAttribute("stop-color", newColor);
            }
        }
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