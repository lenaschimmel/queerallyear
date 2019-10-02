#!/bin/bash
cd ../tool/
browserify browser.js > ../../web/js/modules.js 
cd ../server/
inkscape="/Applications/Inkscape.app/Contents/Resources/bin/inkscape" node server.js