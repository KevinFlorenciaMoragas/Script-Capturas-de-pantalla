const screenshot = require('screenshot-desktop');

let fs = require('fs');

screenshot().then((img) => {
    console.log(img)
    fs.writeFileSync("screen.png", img);
})