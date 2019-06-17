git pull
cd node/tool
npm install
./compile.sh
cd ../server
npm install
forever restart server.js
