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


function flag5spezial(c1, c2, c3, c4, c5) {
    return {
        "Q0": c1,
        "U0": c1,
        "E0": c2,
        "E1": c1,
        "R0": c1,

        "A0": c5,
        "L0": c5,
        "L1": c4,

        "Y0": c3,
        "E2": c4,
        "A1": c5,
        "R1": c5,
    };
}


function flag7(c1, c2, c3, c4, c5, c6, c7) {
    return {
        "Q0": c2,
        "U0": c3,
        "E0": c4,
        "E1": c5,
        "R0": c6,

        "A0": c1,
        "L0": c2,
        "L1": c3,

        "Y0": c4,
        "E2": c5,
        "A1": c6,
        "R1": c7,
    };
}


const white = "#FFFFFF";
const black = "#000000";
const transBlue = "#86D5F7";
const transRose = "#EFBCC5";

const biPink = "#CE3D81";
const biViolet = "#A36AA3";
const biBlue = "#1E4DB0";

const aceGrey = "#B2B2B2";
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
const polyamYellow = "#FFFD52";
const agenderGrey = "#CECECE";
const agenderGreen = "#CDF29F";

exports.aro = flag5(romanticDarkGreen, romanticLightGreen, white, aceGrey, black);
exports.nonbinary = flag4(nonbinaryYellow, white, nonbinaryViolet, black);
exports.genderqueer = flag3(genderqueerViolet, white, genderqueerGreen);
exports.polysexual = flag3(polysexualPink, polysexualGreen, polysexualBlue);
exports.trans = flag5(transBlue, transRose, white, transRose, transBlue);
exports.bi = flag5(biPink, biPink, biViolet, biBlue, biBlue);
exports.pan = flag3(panPink, panYellow, panBlue);
exports.ace = flag4(black, aceGrey, white, aceViolet);
exports.polyam = flag5spezial(polyamBlue, polyamRed, polyamYellow, polyamRed, black);
exports.intersex = flag5spezial(intersexYellow, aceViolet, intersexYellow, aceViolet, intersexYellow);
exports.genderfluid = flag5(genderfluidPink, white, genderfluidViolet, black, genderfluidBlue);
exports.rosa = flag3(transRose, transRose, transRose);
exports.agender = flag7(black, agenderGrey, white, agenderGreen, white, agenderGrey, black);
exports.lebsian = flag7(lebsian1, lebsian2, lebsian3, lebsian4, lebsian5, lebsian6, lebsian7);

exports.allFlags = {
    "Asexuell" : exports.ace, 
    "Bisexuell" : exports.bi, 
    "Pansexuell" : exports.pan, 
    "Trans*" : exports.trans, 
    "Aromantisch" : exports.aro, 
    "Nicht-Binär" : exports.nonbinary,
    "Genderqueer" : exports.genderqueer,
    "Polyamor" : exports.polyam,
    "Polysexuell" : exports.polysexual,
    "Inter*" : exports.intersex,
    "Genderfluid" : exports.genderfluid,
    "Agender" : exports.agender,
    "Lesbisch" : exports.lebsian
};