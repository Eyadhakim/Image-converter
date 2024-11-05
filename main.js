const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const sharp = require('sharp');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
        },
        icon: path.join(__dirname, "public", "icons", "icon.png")
    });
    win.loadFile('index.html');
    win.webContents.openDevTools()
}

app.whenReady().then(() => {
    console.log("app is ready to use")
    createWindow()
});

ipcMain.handle('convert-and-save-images', async (event, images, format) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });

    if (canceled || !filePaths.length) {
        return { success: false, message: 'Output directory not selected.' };
    }

    const outputDir = filePaths[0];
    const outputPaths = [];

    try {
        for (const image of images) {
            const inputBuffer = Buffer.from(image.data, 'base64');
            const outputFileName = `${path.basename(image.name, path.extname(image.name))}.${format}`;
            const outputPath = path.join(outputDir, outputFileName);

            await sharp(inputBuffer)
                .toFormat(format)
                .toFile(outputPath);

            outputPaths.push(outputPath);
        }

        return { success: true, outputPaths };
    } catch (error) {
        console.error("Error during image conversion:", error);
        return { success: false, message: error.message };
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
