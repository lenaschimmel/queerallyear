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

exports.trans = {
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


exports.bi = {
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


exports.pan = {
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


exports.ace = {
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