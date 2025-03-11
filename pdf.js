const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function readImagesFromDirectory(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        throw new Error(`La carpeta ${directoryPath} no existe`);
    }

    const files = fs.readdirSync(directoryPath);
    const imageExtensions = ['.jpg', '.jpeg', '.png'];
    
    const imageFiles = files
        .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
        .map(file => path.join(directoryPath, file));

    if (imageFiles.length === 0) {
        throw new Error('No hay imágenes en la carpeta');
    }

    // Ordenar numéricamente (para 1, 2, 10... en lugar de 1, 10, 2)
    imageFiles.sort((a, b) => {
        const getNumber = (str) => parseInt(str.match(/\d+/)?.[0] || 0);
        return getNumber(a) - getNumber(b);
    });

    return imageFiles;
}

async function createPDFFromFolder(inputFolder, outputPath) {
    try {
        const imagePaths = await readImagesFromDirectory(inputFolder);
        const pdfDoc = await PDFDocument.create();
        let imagesAdded = 0;

        for (const imagePath of imagePaths) {
            try {
                const imageBytes = fs.readFileSync(imagePath, { encoding: null });
                const header = imageBytes.subarray(0, 4).toString('hex');

                let image;
                // Detecta JPEG por su cabecera (ffd8ffe0)
                if (header.startsWith('ffd8')) {
                    image = await pdfDoc.embedJpg(imageBytes); // Tratar como JPG
                } 
                // Detecta PNG por su cabecera (89504e47)
                else if (header.startsWith('89504e47')) {
                    image = await pdfDoc.embedPng(imageBytes);
                } 
                else {
                    throw new Error('Formato no soportado');
                }

                const page = pdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
                imagesAdded++;
            } catch (err) {
                console.error(`❌ Error en ${path.basename(imagePath)}: ${err.message}`);
            }
        }

        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(outputPath, pdfBytes);
        console.log(`✅ PDF creado con ${imagesAdded} imágenes.`);
    } catch (err) {
        console.error('❌ Error crítico:', err.message);
    }
}

// Función para verificar cabecera de PNG (opcional)
function isValidPNG(buffer) {
    const PNG_HEADER = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    return buffer.subarray(0, 8).equals(PNG_HEADER);
}

// Uso
const inputFolder = './fotos/itinerario personal';
const outputPath = 'itinerario personal.pdf';

createPDFFromFolder(inputFolder, outputPath);