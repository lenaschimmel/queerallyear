var convert = require('xml-js');
var util = require('util');
var fs = require('fs');
var color = require('color');

var xml = fs.readFileSync("../progtest.svg");
var js = convert.xml2js(xml, { compact: false, spaces: 4 });

var gradients = js.elements[0].elements[2].elements;
var rangesL = {};
var rangesS = {};
for (const key in gradients) {
    if (gradients.hasOwnProperty(key)) {
        const gradient = gradients[key];
        var id = gradient.attributes.id;
        if (id.length == 3) {
            var letter = id.substring(0,2);
            var stops = gradient.elements;
            
            if(!rangesL[letter]) 
                rangesL[letter] = [];
            if(!rangesS[letter]) 
                rangesS[letter] = [];
            
            rangesL[letter].push(getLightnessRange(stops));
            rangesS[letter].push(getSaturationRange(stops));
        }
    }
}
console.log(util.inspect(rangesL));

composedRangesL = {};
composedRangesS = {};

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

const white = "#FFFFFF";
const black = "#000000";
const transBlue = "#6ad7fb";
const transRose = "#f8b9c5";

const biPink = "#d70271";
const biViolet = "#9c4e98";
const biBlue = "#0035aa";

const aceGrey = "#919191";
const aceViolet = "#922091";

const panPink = "#ff1a8d";
const panYellow = "#ffc500";
const panBlue = "#1ab3ff";
 
trans = {
    "Q0" : transBlue,
    "U0" : transRose,
    "E0" : white,
    "E1" : transRose,
    "R0" : transBlue,

    "A0" : transBlue,
    "L0" : transRose,
    "L1" : transRose,

    "Y0" : white,
    "E2" : white,
    "A1" : transRose,
    "R1" : transBlue,
};


bi = {
    "Q0" : biPink,
    "U0" : biPink,
    "E0" : biViolet,
    "E1" : biBlue,
    "R0" : biBlue,

    "A0" : biPink,
    "L0" : biPink,
    "L1" : biPink,

    "Y0" : biViolet,
    "E2" : biBlue,
    "A1" : biBlue,
    "R1" : biBlue,
};


pan = {
    "Q0" : panPink,
    "U0" : panPink,
    "E0" : panYellow,
    "E1" : panYellow,
    "R0" : panBlue,

    "A0" : panPink,
    "L0" : panPink,
    "L1" : panPink,

    "Y0" : panYellow,
    "E2" : panYellow,
    "A1" : panBlue,
    "R1" : panBlue,
};


ace = {
    "Q0" : black,
    "U0" : aceGrey,
    "E0" : aceGrey,
    "E1" : white,
    "R0" : aceViolet,

    "A0" : black,
    "L0" : aceGrey,
    "L1" : aceGrey,

    "Y0" : white,
    "E2" : white,
    "A1" : aceViolet,
    "R1" : aceViolet,
};

targetColors = pan;

for (const key in gradients) {
    if (gradients.hasOwnProperty(key)) {
        const gradient = gradients[key];
        var id = gradient.attributes.id;
        if (id.length == 3) {
            var letter = id.substring(0,2);
            console.log(letter);

            var targetColor = targetColors[letter];
            var [th, ts, tl] = color(targetColor).hsl().color;
            var stops = gradient.elements;
            var diffLightness = adaptRange(composedRangesL[letter], tl);
            var diffSaturation = adaptRange(composedRangesS[letter], 75);
            console.log("dl: " + diffLightness);
            console.log("ds: " + diffSaturation);

            for (const key2 in stops) {
                if (stops.hasOwnProperty(key2)) {
                    const stop = stops[key2];
                    var stopcolor = color(stop.attributes["stop-color"]);

                    var [sh, ss, sl] = stopcolor.hsl().color;

                    var nh = th;
                    var ns = (ss - diffSaturation) * ts / 100;
                    var nl = sl - diffLightness;

                    var newColor = color.hsl([nh, ns, nl]).hex()
                    stop.attributes["stop-color"] = newColor;
                }
            }
        }
    }
}

function composeRanges(rangeArray) {
    var min, max;
    for (const key in rangeArray) {
        if (rangeArray.hasOwnProperty(key)) {
            const range = rangeArray[key];
            console.log("range: " + util.inspect(range));
            
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
    for (const key2 in stops) {
        if (stops.hasOwnProperty(key2)) {
            const stop = stops[key2];
            var stopcolor = color(stop.attributes["stop-color"]);

            var hsl = stopcolor.hsl().color;
            min = min ? Math.min(min, hsl[index]) : hsl[index];
            max = max ? Math.max(max, hsl[index]) : hsl[index];
        }
    }
    return {
        "min": min,
        "max": max,
        "mid": (min + max) / 2,
        "width": max - min
    };
}


var output = convert.js2xml(js, { compact: false, spaces: 4 });
//console.log(util.inspect(js, {showHidden: false, depth: null}));
fs.writeFileSync("../output.svg", output);