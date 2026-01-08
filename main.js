const { app, BrowserWindow, session, ipcMain } = require('electron');
const path = require('path');

// Track blocked requests
let blockedAdsCount = 0;
let blockedAICount = 0;
let mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false, // Custom title bar for Chrome-style tabs
        webPreferences: {
            webviewTag: true,
            nodeIntegration: true,
            contextIsolation: false,
            webgl: true,
            enableRemoteModule: false
        }
    });

    mainWindow.loadFile('index.html');

    // Get the webview's session (persist:main partition)
    const webviewSession = session.fromPartition('persist:main');

    // Configure session for better Google authentication support
    webviewSession.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
    
    // Enable third-party cookies for authentication flows
    webviewSession.cookies.set({
        url: 'https://accounts.google.com',
        name: 'SameSite',
        value: 'None',
        sameSite: 'no_restriction'
    }).catch(err => console.log('Cookie setting warning:', err));

    // --- ANTI-AI ENGINE START ---
    const aiDomains = [
        // OpenAI
        '*://*.openai.com/*',
        '*://*.chatgpt.com/*',
        // Anthropic
        '*://*.anthropic.com/*',
        '*://*.claude.ai/*',
        // Perplexity
        '*://*.perplexity.ai/*',
        // Google AI
        '*://*.bard.google.com/*',
        '*://gemini.google.com/*',
        '*://*.deepmind.com/*',
        '*://*.deepmind.google/*',
        // Microsoft AI
        '*://*.copilot.microsoft.com/*',
        '*://copilot.microsoft.com/*',
        '*://*.bing.com/chat*',
        '*://*.bing.com/create*',
        // Meta AI
        '*://*.meta.ai/*',
        '*://meta.ai/*',
        // xAI
        '*://*.x.ai/*',
        '*://grok.x.ai/*',
        // Image AI
        '*://*.midjourney.com/*',
        '*://*.stability.ai/*',
        '*://*.leonardo.ai/*',
        '*://*.dalle.com/*',
        // Other AI services
        '*://*.character.ai/*',
        '*://*.poe.com/*',
        '*://*.you.com/*',
        '*://*.jasper.ai/*',
        '*://*.writesonic.com/*',
        '*://*.copy.ai/*',
        '*://*.huggingface.co/chat*',
        '*://*.replicate.com/*',
        '*://*.cohere.ai/*',
        '*://*.ai21.com/*'
    ];

    const aiFilter = { urls: aiDomains };

    webviewSession.webRequest.onBeforeRequest(aiFilter, (details, callback) => {
        console.log("Blocked AI Request:", details.url);
        blockedAICount++;
        sendBlockedCounts();
        callback({ cancel: true });
    });
    // --- ANTI-AI ENGINE END ---

    // --- AD BLOCKER START ---
    const adDomains = [
        // Google Ads
        '*://*.doubleclick.net/*',
        '*://*.googlesyndication.com/*',
        '*://*.googleadservices.com/*',
        '*://*.google-analytics.com/*',
        '*://*.googletagmanager.com/*',
        '*://*.googletagservices.com/*',
        '*://*.adservice.google.com/*',
        '*://pagead2.googlesyndication.com/*',
        // Facebook/Meta Ads
        '*://*.facebook.com/tr*',
        '*://*.facebook.net/*/fbevents.js*',
        '*://*.facebook.com/plugins/*',
        // Major Ad Networks
        '*://*.advertising.com/*',
        '*://*.amazon-adsystem.com/*',
        '*://*.criteo.com/*',
        '*://*.criteo.net/*',
        '*://*.outbrain.com/*',
        '*://*.taboola.com/*',
        '*://*.zedo.com/*',
        '*://*.2mdn.net/*',
        '*://*.adnxs.com/*',
        '*://*.rubiconproject.com/*',
        '*://*.pubmatic.com/*',
        '*://*.casalemedia.com/*',
        '*://*.openx.net/*',
        '*://*.sharethrough.com/*',
        '*://*.adsrvr.org/*',
        '*://*.spotxchange.com/*',
        '*://*.indexww.com/*',
        // Tracking
        '*://*.scorecardresearch.com/*',
        '*://*.quantserve.com/*',
        '*://*.hotjar.com/*',
        '*://*.mixpanel.com/*',
        '*://*.segment.io/*',
        '*://*.segment.com/*',
        '*://*.amplitude.com/*',
        '*://*.newrelic.com/*',
        '*://*.nr-data.net/*',
        '*://*.bugsnag.com/*',
        '*://*.sentry.io/*',
        // More Ad Networks
        '*://*.measureadv.com/*',
        '*://*.yellowblue.io/*',
        '*://*.mrtnsvr.com/*',
        '*://*.gammaplatform.com/*',
        '*://*.moatads.com/*',
        '*://*.adsafeprotected.com/*',
        '*://*.doubleverify.com/*',
        '*://*.serving-sys.com/*',
        '*://*.adroll.com/*',
        '*://*.adhigh.net/*',
        '*://*.adcolony.com/*',
        '*://*.unity3d.com/ads/*',
        '*://*.unityads.unity3d.com/*',
        // Popups & Malware
        '*://*.popads.net/*',
        '*://*.popcash.net/*',
        '*://*.propellerads.com/*'
    ];

    const adFilter = { urls: adDomains };

    webviewSession.webRequest.onBeforeRequest(adFilter, (details, callback) => {
        console.log("Blocked Ad:", details.url);
        blockedAdsCount++;
        sendBlockedCounts();
        callback({ cancel: true });
    });
    // --- AD BLOCKER END ---

    // Handle window controls from renderer
    ipcMain.on('window-minimize', () => mainWindow.minimize());
    ipcMain.on('window-maximize', () => {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    });
    ipcMain.on('window-close', () => mainWindow.close());

    // Send blocked counts on request
    ipcMain.on('get-blocked-counts', () => sendBlockedCounts());
}

function sendBlockedCounts() {
    if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send('blocked-counts', {
            ads: blockedAdsCount,
            ai: blockedAICount
        });
    }
}

app.whenReady().then(createWindow);

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