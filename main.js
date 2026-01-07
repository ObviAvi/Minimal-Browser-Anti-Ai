const { app, BrowserWindow, session } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            webviewTag: true, // Crucial: Allows us to use the <webview> tag
            nodeIntegration: true,
            contextIsolation: false,
            webgl: true,
            enableRemoteModule: false
        }
    });

    win.loadFile('index.html');

    // --- ANTI-AI ENGINE START ---
    const aiFilter = {
        urls: ['*://*.openai.com/*', '*://*.anthropic.com/*', '*://*.perplexity.ai/*']
    };

    session.defaultSession.webRequest.onBeforeRequest(aiFilter, (details, callback) => {
        console.log("Blocked AI Request:", details.url);
        callback({ cancel: true });
    });
    // --- ANTI-AI ENGINE END ---

    // --- AD BLOCKER START ---
    const adFilter = {
        urls: [
            '*://*.doubleclick.net/*',
            '*://*.googlesyndication.com/*',
            '*://*.googleadservices.com/*',
            '*://*.google-analytics.com/*',
            '*://pagead2.googlesyndication.com/*',
            '*://*.youtube.com/api/stats/ads*',
            '*://*.youtube.com/pagead/*',
            '*://*.youtube.com/ptracking*',
            '*://*.youtube.com/api/stats/qoe*',
            '*://*.scorecardresearch.com/*',
            '*://*.facebook.com/tr*',
            '*://*.facebook.net/*/fbevents.js*',
            '*://*.adservice.google.com/*',
            '*://*.advertising.com/*',
            '*://*.amazon-adsystem.com/*',
            '*://*.criteo.com/*',
            '*://*.outbrain.com/*',
            '*://*.taboola.com/*',
            '*://*.zedo.com/*',
            '*://*.2mdn.net/*'
        ]
    };

    session.defaultSession.webRequest.onBeforeRequest(adFilter, (details, callback) => {
        console.log("Blocked Ad:", details.url);
        callback({ cancel: true });
    });
    // --- AD BLOCKER END ---
}

app.whenReady().then(createWindow);