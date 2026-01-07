const { app, BrowserWindow, session } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            webviewTag: true, // Crucial: Allows us to use the <webview> tag
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');

    // --- ANTI-AI ENGINE START ---
    const filter = {
        urls: ['*://*.openai.com/*', '*://*.anthropic.com/*', '*://*.perplexity.ai/*']
    };

    session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
        console.log("Blocked AI Request:", details.url);
        callback({ cancel: true }); // This stops the AI from loading
    });
    // --- ANTI-AI ENGINE END ---
}

app.whenReady().then(createWindow);