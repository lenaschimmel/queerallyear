const GradientSvg = require('./recolor.js');
const flags = require('./flags.js');
const util = require('util');
var colorLib = require('color');

var lastLayout = "";
var activeColor = "#000000";
var lines = 1;
var domain = "off";

window.queer = {};
window.queer.showflag = function (flagName, animate = true) {
    mainLogo.changeGradients(flags.flagmap(2, flags.allFlags[flagName], flagName, domain == "bold"), animate);
}

window.queer.initFlagAnimation = function () {

    mainLogo = new GradientSvg(window.document.getElementById("mainlogo"), window.document, window);
    mainLogo.setShadowMode("off");
    mainLogo.setDomainMode("off");
    queer.showflag("Gay", false);

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

            mainLogo.changeGradients(flags.flagmap(2, flags.allFlags[flagName], flagName, domain == "bold"), true);
        }
    }

    setInterval(nextFlag, 3500);
}

window.queer.initPreviewLogo = function() {
    previewLogo = new GradientSvg(window.document.getElementById("previewlogo"), window.document, window);
    previewLogo.setShadowMode("off");
    flags.letters.forEach(letter => {
        $("#"+letter).attr("value", sessionStorage.getItem(letter) || "FFFFFF");
    });
    window.queer.flagSelected();
    window.queer.layoutSelected();
    window.queer.domainSelected();
    var gs = window.document.getElementsByTagName("g");
    for (let g of gs) {
        if(g.getAttribute("id").startsWith("letter")) {
            var letter = g.getAttribute("id").substring(6);
            if(letter.length == 2) {
                g.setAttribute("onclick", "queer.colorLetter('"+ letter +"')");
            }
        }
    }
}

window.queer.colorLetter = function(letter) {
    $("#"+letter).attr("value", activeColor.substring(1));
    sessionStorage.setItem(letter, activeColor.substring(1));
    previewLogo.colorLetter(letter, activeColor);
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
    if(flagName == "Eigene Farbkombination") {
        flags.letters.forEach(letter => {
            var color = "#" + ($("#"+letter).val() || "FFFFFF");
            previewLogo.colorLetter(letter, color, false);
        });
        $("#colors").removeClass("hidden");
    } else {
        previewLogo.changeGradients(flags.flagmap(lines, flags.allFlags[flagName], flagName, domain == "bold"), false);
        $("#colors").addClass("hidden");
    }
    shadow = $("#withshadow").is(":checked");
    previewLogo.setShadowMode(shadow ? "on" : "off");
}

window.queer.layoutSelected = function () {
    layoutName = $("#layoutselect :selected").val();
    lines = flags.linesInDesign(layoutName);
    
    if(lastLayout != layoutName) {
        lastLayout = layoutName;
        console.log("Layout: " + layoutName);
        $.get("/img/shadow/" + layoutName + ".svg", function(data) {
            data.documentElement.setAttribute("id", "previewlogo");
            $("#previewlogo").replaceWith(data.documentElement);
            queer.initPreviewLogo();
        });
    }
    
}

window.queer.domainSelected = function () {
    domain = $("#domainselect :selected").val();
    previewLogo.setDomainMode(domain);
    queer.flagSelected();
}

window.queer.initColors = function() {
    var x = "<div class='colorgroup'>";
    for (let l = 0; l < 100; l+= 15) {
        var color = colorLib.hsl(0,0,l);
        id = "color" + color.hex().substring(1);
        x += '<div class="cd '+id+'" style="background-color:'+color+'" onclick="queer.activateColor(\''+id+'\');" />';
    }
    x += " (Gray)</div>";
    $("#swatches").append(x);

    for (const flagKey in flags.allFlags) {
        if (flags.allFlags.hasOwnProperty(flagKey)) {
            const flag = flags.allFlags[flagKey];
            
            var colors = {};
            for (const letterKey in flag) {
                if (flag.hasOwnProperty(letterKey)) {
                    const color = flag[letterKey];
                    colors[color] = true;
                }
            }

            var x = "<div class='colorgroup'>";
            for(const color in colors) {
                id = "color" + color.substring(1);
                x += '<div class="cd '+id+'" style="background-color:'+color+'" onclick="queer.activateColor(\''+id+'\');" />';
            }
            x += " ("+flagKey+")</div>";
            $("#swatches").append(x);
        }
    }

    document.getElementById('owncolor').addEventListener("change", window.queer.ownColorChanged);
}

window.queer.activateColor = function(id) {
    $(".cd").removeClass("active");
    $("." + id).addClass("active");
    activeColor = "#" + id.substring(5);
}

window.queer.ownColorChanged = function() {
    $(".cd").removeClass("active");
    activeColor = document.getElementById('owncolor').value;
    console.log("Color selected: " +  activeColor);
}