const screenshot = require('screenshot-desktop');
const keySender = require('node-key-sender');
const fs = require('fs');
const path = require('path');

const screenshotInterval = 2000;
let screenshotCount = 0;
const screenshotPath = 'D:/capturas/Guia en el medio natural acuatico'; 

// Asegúrate de que la carpeta "screenshots" existe
if (!fs.existsSync(screenshotPath)){
    try {
        fs.mkdirSync(screenshotPath, { recursive: true });
        console.log(`Carpeta creada en: ${screenshotPath}`);
    } catch (err) {
        console.error('Error al crear la carpeta:', err);
        process.exit(1); 
    }
}

function takeScreenshot() {
    screenshot().then((img) => {
        const filename = `${screenshotCount}.png`;
        const filepath = path.join(screenshotPath, filename);
        
        try {
            fs.writeFileSync(filepath, img);
            console.log(`Captura tomada: ${filepath}`);
            screenshotCount++;
        } catch (err) {
            console.error('Error al guardar la captura de pantalla:', err);
        }
    }).catch((err) => {
        console.error('Error al tomar la captura de pantalla:', err);
    });
}

function handleRightClick() {
    try {
        keySender.sendKey('right');
        console.log('Página cambiada');
        takeScreenshot();
    } catch (err) {
        console.error('Error al simular la tecla de flecha derecha:', err);
    }
}


setInterval(handleRightClick, screenshotInterval);