const GradientSvg = require('./recolor.js');
const flags = require('./flags.js');
const util = require('util');


window.queer = {};
window.queer.showflag = function (flagname) {
    mainLogo.changeGradients(flags[flagname], true);
}

window.queer.initFlagAnimation = function () {

    mainLogo = new GradientSvg(window.document.getElementById("mainlogo"), window.document, window);
    mainLogo.setShadowMode("off");

    var lastFlagName = "Gay";

    function nextFlag() {
        if (!document.hidden) {
            var keys = Object.keys(flags.allFlags)
            do {
                flagName = keys[keys.length * Math.random() << 0];
            } while (flagName == lastFlagName);
            lastFlagName = flagName;
            $("#identity").fadeOut(500, () => {
                $("#identity").html("(" + flagName + ")").fadeIn(500);
            });

            mainLogo.changeGradients(flags.allFlags[flagName], true);
        }
    }

    setInterval(nextFlag, 3500);
}

window.queer.initPreviewLogo = function() {
    previewLogo = new GradientSvg(window.document.getElementById("previewlogo"), window.document, window);
    previewLogo.setShadowMode("off");
    window.queer.flagSelected();
    window.queer.layoutSelected();
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
    shadow = $("#withshadow").is(":checked");
    previewLogo.changeGradients(flags.allFlags[flagName], false);
    previewLogo.setShadowMode(shadow ? "on" : "off");
}

window.queer.layoutSelected = function () {
    layoutName = $("#layoutselect :selected").val();
    console.log("Layout: " + layoutName);
    $.get("/img/shadow/" + layoutName + ".svg", function(data) {
        data.documentElement.setAttribute("id", "previewlogo");
        $("#previewlogo").replaceWith(data.documentElement);
        previewLogo = new GradientSvg(window.document.getElementById("previewlogo"), window.document, window);

        flagName = $("#flagselect :selected").val();
        shadow = $("#withshadow").is(":checked");
        previewLogo.changeGradients(flags.allFlags[flagName], false);
        previewLogo.setShadowMode(shadow ? "on" : "off");
    });

    
}