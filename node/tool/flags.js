exports.flagmap = function (lines, c, flagName, colorDomain = false) {
    if (lines == 1) {
        if (c.length == 3) {
            return { "Q0": c[0], "U0": c[0], "E0": c[0], "E1": c[0], "R0": c[0], "A0": c[1], "L0": c[1], "L1": c[1], "Y0": c[2], "E2": c[2], "A1": c[2], "R1": c[2] };
        } else {
            var ret = {};
            var relevantCount = exports.letters.length - (colorDomain ? 0 : 3);
            console.log("Mapping on letter count: " + relevantCount);
            for (let i = 0; i < relevantCount; i++) {
                const letter = exports.letters[i];
                ret[letter] = c[Math.floor(i * c.length / relevantCount)];
            }
        }
        return ret;
    }

    if (lines == 2) {
        if(flagName == "Inter")
            return { "Q0": c[0], "U0": c[0], "E0": c[1], "E1": c[0], "R0": c[0], "A0": c[0], "L0": c[0], "L1": c[1], "Y0": c[0], "E2": c[1], "A1": c[0], "R1": c[0] };
        else if(flagName == "Polyamor") // [polyamBlue, polyamRed, polyamYellow, polyamRed, black];
            return { "Q0": c[0], "U0": c[0], "E0": c[1], "E1": c[3], "R0": c[4], "A0": c[0], "L0": c[0], "L1": c[1], "Y0": c[2], "E2": c[1], "A1": c[4], "R1": c[4] };
        else if (c.length == 3)
            return { "Q0": c[0], "U0": c[0], "E0": c[1], "E1": c[1], "R0": c[2], "A0": c[0], "L0": c[0], "L1": c[0], "Y0": c[1], "E2": c[1], "A1": c[2], "R1": c[2] };
        else if (c.length == 4)
            return { "Q0": c[0], "U0": c[1], "E0": c[1], "E1": c[2], "R0": c[3], "A0": c[0], "L0": c[1], "L1": c[1], "Y0": c[2], "E2": c[2], "A1": c[3], "R1": c[3] };
        else if (c.length == 5)
            return { "Q0": c[0], "U0": c[1], "E0": c[2], "E1": c[3], "R0": c[4], "A0": c[0], "L0": c[1], "L1": c[1], "Y0": c[2], "E2": c[2], "A1": c[3], "R1": c[4] };
        else if (c.length == 7)
            return { "Q0": c[1], "U0": c[2], "E0": c[3], "E1": c[4], "R0": c[5], "A0": c[0], "L0": c[1], "L1": c[2], "Y0": c[3], "E2": c[4], "A1": c[5], "R1": c[6] };
        else if (c.length == 8)
            return { "Q0": c[1], "U0": c[2], "E0": c[3], "E1": c[5], "R0": c[6], "A0": c[0], "L0": c[1], "L1": c[2], "Y0": c[4], "E2": c[5], "A1": c[6], "R1": c[7] };
    }

    if (lines == 3) {
        if(flagName == "Inter")
            return { "Q0": c[0], "U0": c[0], "E0": c[1], "E1": c[0], "R0": c[0], "A0": c[1], "L0": c[0], "L1": c[1], "Y0": c[0], "E2": c[0], "A1": c[1], "R1": c[0] };
        else if(flagName == "Polyamor")
            return { "Q0": c[0], "U0": c[0], "E0": c[0], "E1": c[0], "R0": c[0], "A0": c[1], "L0": c[2], "L1": c[1], "Y0": c[4], "E2": c[4], "A1": c[4], "R1": c[4] };
        else if(flagName == "Kinky") // [kinkBlue, black, kinkBlue, white, kinkRed, black, kinkBlue];
            return { "Q0": c[0], "U0": c[1], "E0": c[0], "E1": c[1], "R0": c[0], "A0": c[3], "L0": c[4], "L1": c[3], "Y0": c[1], "E2": c[0], "A1": c[1], "R1": c[0] };
        else if (c.length == 3)
            return { "Q0": c[0], "U0": c[0], "E0": c[0], "E1": c[0], "R0": c[0], "A0": c[1], "L0": c[1], "L1": c[1], "Y0": c[2], "E2": c[2], "A1": c[2], "R1": c[2] };
        else if (c.length == 4)
            return { "Q0": c[0], "U0": c[1], "E0": c[1], "E1": c[2], "R0": c[3], "A0": c[0], "L0": c[1], "L1": c[1], "Y0": c[2], "E2": c[2], "A1": c[3], "R1": c[3] };
        else if (c.length == 5)
            return { "Q0": c[0], "U0": c[0], "E0": c[1], "E1": c[2], "R0": c[4], "A0": c[1], "L0": c[2], "L1": c[3], "Y0": c[1], "E2": c[2], "A1": c[3], "R1": c[4] };
        else if (c.length == 7)
            return { "Q0": c[1], "U0": c[2], "E0": c[3], "E1": c[4], "R0": c[5], "A0": c[0], "L0": c[1], "L1": c[2], "Y0": c[3], "E2": c[4], "A1": c[5], "R1": c[6] };
        else if (c.length == 8)
            return { "Q0": c[2], "U0": c[3], "E0": c[4], "E1": c[5], "R0": c[6], "A0": c[0], "L0": c[1], "L1": c[1], "Y0": c[4], "E2": c[5], "A1": c[6], "R1": c[7] };
    }
}

exports.linesInDesign = function (layoutName) {
    console.log("linesInDesign");
    if (layoutName.indexOf("1") > 0) return 1;
    if (layoutName.indexOf("2") > 0) return 2;
    if (layoutName.indexOf("3") > 0) return 3;
    console.log("Unknown number of lines in " + layoutName);
    return 1;
}

function flag5spezial(c) {
    return {
        "Q0": c[0],
        "U0": c[0],
        "E0": c[1],
        "E1": c[4],
        "R0": c[4],

        "A0": c[0],
        "L0": c[0],
        "L1": c[3],

        "Y0": c[2],
        "E2": c[3],
        "A1": c[4],
        "R1": c[4],
    };
}

const white = "#FFFFFF";
const black = "#000000";
const transBlue = "#86D5F7";
const transRose = "#EFBCC5";

const biPink = "#CE3D81";
const biViolet = "#A36AA3";
const biBlue = "#1E4DB0";

const aceGrey = "#A0A0A0";
const aceViolet = "#882B8E";

const panPink = "#EE539C";
const panYellow = "#FADE49";
const panBlue = "#5BBDF9";

const romanticDarkGreen = "#60AB58";
const romanticLightGreen = "#B8D58E";
const intersexYellow = "#FADE49";
const nonbinaryYellow = "#FDF363";
const nonbinaryViolet = "#A577D4";
const genderqueerViolet = "#BC97DE";
const genderqueerGreen = "#67903D";
const phillyBrown = "#86632B";
const genderfluidPink = "#F295B2";
const genderfluidViolet = "#BC49D7";
const genderfluidBlue = "#4656C2";
const polysexualPink = "#E752C1";
const polysexualGreen = "#5CD685";
const polysexualBlue = "#4EA3F1";
const lebsian1 = "#A83072";
const lebsian2 = "#BB70A1";
const lebsian3 = "#CF7EB3";
const lebsian4 = "#F1F0EF";
const lebsian5 = "#E4BED7";
const lebsian6 = "#C66A68";
const lebsian7 = "#933514";
const polyamRed = "#ED4024";
const polyamBlue = "#1432F5";
const polyamYellow = "#EEEA49";
const agenderGrey = "#A0A0A0";
const agenderGreen = "#CDF29F";
const kinkBlue = "#0E24C0";
const kinkRed = "#ED4024";

const gayRed = "#CA0E26";
const gayOrange = "#EC7408";
const gayYellow = "#F9DA00";
const gayGreen = "#6FB327";
const gayBlue = "#073E85";
const gayViolet = "#8E3371";
const gayPink = "#E4007D";


exports.allColors = [
    white, black, transBlue, transRose, biPink, biViolet, biBlue, aceGrey, aceViolet, panPink, panYellow, panBlue,
    romanticDarkGreen, romanticLightGreen, intersexYellow, nonbinaryYellow, nonbinaryViolet, genderqueerViolet,
    genderqueerGreen, phillyBrown, genderfluidPink, genderfluidViolet, genderfluidBlue, polysexualPink, polysexualGreen,
    polysexualBlue, lebsian1, lebsian2, lebsian3, lebsian4, lebsian5, lebsian6, lebsian7, polyamRed, polyamBlue,
    polyamYellow, agenderGrey, agenderGreen, kinkBlue, kinkRed, gayRed, gayOrange, gayYellow, gayGreen, gayBlue, gayViolet, gayPink
];


exports.gay =           [gayRed,    gayOrange,  gayYellow, gayGreen, gayBlue, gayViolet, gayPink];
exports.philly =        [black,     phillyBrown,    gayRed, gayOrange, gayYellow, gayGreen, gayBlue, gayViolet];
exports.aro =           [romanticDarkGreen,     romanticLightGreen,     white, aceGrey, black];
exports.nonbinary =     [nonbinaryYellow,   white,  nonbinaryViolet, black];
exports.genderqueer =   [genderqueerViolet,     white,  genderqueerGreen];
exports.polysexual =    [polysexualPink,    polysexualGreen,    polysexualBlue];
exports.trans =         [transBlue,     transRose,  white, transRose, transBlue];
exports.bi =            [biPink,    biViolet,   biBlue];
exports.pan =           [panPink,   panYellow,  panBlue];
exports.ace =           [black,     aceGrey,    white, aceViolet];
exports.genderfluid =   [genderfluidPink,   white,  genderfluidViolet, black, genderfluidBlue];
exports.rosa =          [transRose,     transRose,  transRose];
exports.agender =       [black,     agenderGrey,    white, agenderGreen, white, agenderGrey, black];
exports.lebsian =       [lebsian1,  lebsian2,   lebsian3, lebsian4, lebsian5, lebsian6, lebsian7];
exports.polyam =         /*spezial*/ [polyamBlue, polyamRed, polyamYellow, polyamRed, black];
exports.intersex =       /*spezial*/ [intersexYellow, aceViolet, intersexYellow, aceViolet, intersexYellow];
exports.kink =           /*spezial*/ [kinkBlue, black, kinkBlue, white, kinkRed, black, kinkBlue];

exports.allFlags = {
    "Gay": exports.gay,
    "MoreColorPride": exports.philly,
    "Asexuell": exports.ace,
    "Bisexuell": exports.bi,
    "Pansexuell": exports.pan,
    "Trans": exports.trans,
    "Aromantisch": exports.aro,
    "Nicht-Binär": exports.nonbinary,
    "Genderqueer": exports.genderqueer,
    "Polyamor": exports.polyam,
    "Polysexuell": exports.polysexual,
    "Inter": exports.intersex,
    "Genderfluid": exports.genderfluid,
    "Agender": exports.agender,
    "Lesbisch": exports.lebsian,
    "Kinky": exports.kink
};

exports.letters = ["Q0", "U0", "E0", "E1", "R0", "A0", "L0", "L1", "Y0", "E2", "A1", "R1", "P0", "D0", "E3"];

exports.layouts = ["block2", "block3", "orig2", "orig3", "vert1", "vert2", "vert3"];

