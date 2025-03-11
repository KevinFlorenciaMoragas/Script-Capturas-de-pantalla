const screenshot = require('screenshot-desktop');
const keySender = require('node-key-sender');
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const screenshotPath = 'D:/capturas/empleabilidad 2';
let screenshotCount = 0;

// Crear carpeta si no existe
if (!fs.existsSync(screenshotPath)) {
    fs.mkdirSync(screenshotPath, { recursive: true });
}

async function takeScreenshot() {
    try {
        const img = await screenshot({ screen: 'main' });
        
        // Validar PNG
        new PNG().parse(img); // Lanza error si no es válido
        
        const filename = `${Date.now()}_${screenshotCount}.png`;
        const filepath = path.join(screenshotPath, filename);
        
        fs.writeFileSync(filepath, img);
        console.log(`Captura guardada: ${filepath}`);
        screenshotCount++;
    } catch (err) {
        console.error('Error en captura:', err.message);
    }
}

async function handleRightClick() {
    try {
        keySender.sendKey('right');
        console.log('Tecla derecha presionada');
        
        // Esperar 500ms para que la página cargue
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await takeScreenshot();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

// Ejecutar cada 2500ms (2 segundos + 500ms de espera)
setInterval(handleRightClick, 2500);
