function flag5(c1, c2, c3, c4, c5) {
    return {
        "Q0": c1,
        "U0": c2,
        "E0": c3,
        "E1": c4,
        "R0": c5,

        "A0": c1,
        "L0": c2,
        "L1": c2,

        "Y0": c3,
        "E2": c3,
        "A1": c4,
        "R1": c5,
    };
}

function flag3(c1, c2, c3) {
    return {
        "Q0": c1,
        "U0": c1,
        "E0": c2,
        "E1": c2,
        "R0": c3,

        "A0": c1,
        "L0": c1,
        "L1": c1,

        "Y0": c2,
        "E2": c2,
        "A1": c3,
        "R1": c3,
    };
}

function flag4(c1, c2, c3, c4) {
    return {
        "Q0": c1,
        "U0": c2,
        "E0": c2,
        "E1": c3,
        "R0": c4,

        "A0": c1,
        "L0": c2,
        "L1": c2,

        "Y0": c3,
        "E2": c3,
        "A1": c4,
        "R1": c4,
    };
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
const polyamYellow = "#FFFD52";

exports.aro = flag5(romanticDarkGreen, romanticLightGreen, white, aceGrey, black);
exports.nonbinary = flag4(nonbinaryYellow, white, nonbinaryViolet, black);
exports.genderqueer = flag3(genderqueerViolet, white, genderqueerGreen);
exports.polysexual = flag4(polysexualPink, polysexualGreen, polysexualBlue);
exports.trans = flag5(transBlue, transRose, white, transRose, transBlue);
exports.bi = flag5(biPink, biPink, biViolet, biBlue, biBlue);
exports.pan = flag3(panPink, panYellow, panBlue);
exports.ace = flag4(black, aceGrey, white, aceViolet);
exports.polyam = flag4(polyamBlue, polyamRed, polyamYellow, black);

exports.allFlags = {
    "Asexuell" : exports.ace, 
    "Bisexuell" : exports.bi, 
    "Pansexiell" : exports.pan, 
    "Trans*" : exports.trans, 
    "Aromantisch" : exports.aro, 
    "Nicht-Binär" : exports.nonbinary,
    "Genderqueer" : exports.genderqueer,
    "Polyamor" : exports.polyam,
    "Polysexuell" : exports.polysexual
};