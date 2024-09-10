const { firefox } = require('playwright'); // Importar Firefox desde Playwright
const fs = require('fs');
const path = require('path');

const screenshotInterval = 2000; // Intervalo de captura de pantalla en milisegundos
let screenshotCount = 0; // Contador de capturas de pantalla
const screenshotPath = 'D:/capturas/comunes/'; // Ruta para guardar las capturas

// Asegúrate de que la carpeta de capturas existe
if (!fs.existsSync(screenshotPath)) {
    try {
        fs.mkdirSync(screenshotPath, { recursive: true });
        console.log(`Carpeta creada en: ${screenshotPath}`);
    } catch (err) {
        console.error('Error al crear la carpeta:', err);
        process.exit(1);
    }
}

// Función para tomar capturas de pantalla
function takeScreenshot(page) {
    const filename = `${screenshotCount}.png`;
    const filepath = path.join(screenshotPath, filename);

    page.screenshot({ path: filepath, fullPage: true }) // Tomar captura de pantalla de toda la página
        .then(() => {
            console.log(`Captura tomada: ${filepath}`);
            screenshotCount++;
        })
        .catch((err) => {
            console.error('Error al tomar la captura de pantalla:', err);
        });
}

// Función principal
(async () => {
    // Iniciar Firefox con Playwright
    const browser = await firefox.launch({ headless: false }); // headless: false para ver el navegador
    const context = await browser.newContext({viewport: { width: 1920, height: 1080 }}); // Pantalla completa
    const page = await context.newPage();
    await page.goto('http://www.aranformacion.es/librosdigitales/LIB_I_3_C_1/files/assets/basic-html/page-1.html');

    // Función para manejar el clic derecho y tomar capturas
    async function handleRightClick() {
        try {
            const viewport = await page.viewportSize()
            let screenWidth = viewport.width;
            let screenHeight = viewport.height;
            screenHeight = (screenHeight / 4) + 200;
            screenWidth = (screenHeight / 2 ) + 100;
            console.log(screenHeight,screenWidth)
            // Simular un clic del ratón en las coordenadas (500, 300)
            await page.mouse.click(screenWidth, screenHeight);
            console.log(`Clic simulado en (${screenWidth},${screenHeight})`);

            // Tomar una captura de pantalla
            takeScreenshot(page);
        } catch (err) {
            console.error('Error al simular el clic del ratón:', err);
        }
    }

    // Configurar el intervalo para ejecutar handleRightClick
    setInterval(handleRightClick, screenshotInterval);

    // Cerrar el navegador después de un tiempo (opcional)
    setTimeout(async () => {
        await browser.close();
        console.log('Navegador cerrado.');
    }, 60000); // Cerrar después de 60 segundos
})();
