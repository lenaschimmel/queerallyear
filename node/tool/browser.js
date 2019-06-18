const recolor = require('./recolor.js');
const flags = require('./flags.js');
const util = require('util');

var gradients = window.document.getElementsByTagName("defs").item(0);
recolor.prepareGradients(gradients);

window.queer = {};
window.queer.showflag = function (flagname) {
    recolor.changeGradients(gradients, flags[flagname], true);
}



window.queer.initFlagAnimation = function () {
    var lastFlagName = "Gay";

    function nextFlag() {
        if (!document.hidden) {
            var keys = Object.keys(flags.allFlags)
            do {
                flagName = keys[keys.length * Math.random() << 0];
            } while (flagName == lastFlagName);
            lastFlagName = flagName;
            console.log("flagName: " + util.inspect(flagName));
            $("#identity").fadeOut(500, () => {
                $("#identity").html("(" + flagName + ")").fadeIn(500);
            });

            recolor.changeGradients(gradients, flags.allFlags[flagName], true);
        }
    }

    setInterval(nextFlag, 3500);
}




window.queer.initArrow = function () {

    window.queer.scrollDown = function () {
        $('html,body').animate({ scrollTop: document.body.scrollHeight }, "slow");
        $("#arrow").fadeOut(300);
    }

    window.queer.scrollUp = function () {
        $('html,body').animate({ scrollTop: 0 }, "slow");
    }

    function headingVisible(entries, observer) {
        entries.forEach(entry => {
            if (entry.intersectionRatio > 0.6) {
                $("#arrow").fadeOut(300);
            }
        });
    }

    var options = {
        rootMargin: '0px',
        threshold: 1.0
    }

    var observer = new IntersectionObserver(headingVisible, options);
    var target = document.querySelector('#firstHeading');
    observer.observe(target);
}

window.queer.flagSelected = function () {
    flagName = $("#flagselect :selected").val();
    console.log("Selected flag: " + flagName);
    recolor.changeGradients(gradients, flags.allFlags[flagName], false);
}