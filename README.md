# Anti-AI Minimalist Browser

A beautiful, privacy-focused Electron browser with built-in AI blocking and a neumorphic design aesthetic.


## Features

### Anti-AI Engine
- Blocks requests to OpenAI, Anthropic, and Perplexity at the network level
- Prevents AI chatbots and assistants from loading on any website
- Real-time blocking indicator with status badge

### Privacy-First Search
- Custom search results UI powered by DuckDuckGo
- No tracking or data collection
- Clean, distraction-free search experience
- Website favicons for easy identification

###  Minimalist Design
- Neumorphic UI with soft shadows and rounded edges
- Light and dark mode with smooth transitions
- Animated interactions and hover effects
- Minimalist aesthetic with focus on content


## 📦 Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (comes with Node.js)

### Setup

1. **Clone or download this repository**
```bash
git clone <your-repo-url>
cd MinimalBrowser
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the browser**
```bash
npm start
```

## 🚀 Usage

### Basic Navigation
- **Search**: Type any query in the search bar and press Enter
- **Visit URL**: Type a website address (e.g., `github.com`) and press Enter
- **Quick Links**: Click any of the home page cards to visit popular sites
- **Go Back/Forward**: Use the arrow buttons to navigate history
- **Refresh**: Click the refresh button to reload the current page
- **Home**: Click the home icon to return to the start page

### Dark Mode
Click the moon/sun icon in the top-right to toggle between light and dark themes. Your preference is saved automatically.

### AI Blocking
The browser automatically blocks all requests to:
- `*.openai.com` (ChatGPT)
- `*.anthropic.com` (Claude)
- `*.perplexity.ai` (Perplexity)

The teal "AI BLOCKED" badge confirms the protection is active.

## How It Works

### Anti-AI Technology
The browser uses Electron's `webRequest` API to intercept and block network requests before they reach AI services:

```javascript
session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
    console.log("Blocked AI Request:", details.url);
    callback({ cancel: true });
});
```

This means AI chatbots, widgets, and integrations are stopped at the network level - they never load.

### Search Integration
- Fetches DuckDuckGo HTML results
- Parses and extracts titles, URLs, and descriptions
- Displays in custom-styled results page
- Supports both light and dark themes

### Architecture
- **Main Process** (`main.js`): Electron app lifecycle and request filtering
- **Renderer Process** (`index.html`): UI, navigation, and search logic
- **Styling** (`style.css`): Neumorphic design with CSS variables for theming

## Project Structure

```
MinimalBrowser/
├── index.html          # Main UI and application logic
├── main.js             # Electron main process & AI blocking
├── style.css           # Neumorphic styling & animations
├── package.json        # Dependencies and scripts
└── README.md          
```

## Configuration

### Add More Blocked Domains
Edit `main.js` and add domains to the filter:

```javascript
const filter = {
    urls: [
        '*://*.openai.com/*',
        '*://*.anthropic.com/*',
        '*://*.perplexity.ai/*',
        '*://*.example.com/*'  // Add your domain here
    ]
};
```

### Customize Quick Links
Edit the `quickLinks` array in `index.html`:

```javascript
const quickLinks = [
    'https://wikipedia.org',
    'https://your-site.com',  // Add your link
    // ...
];
```

## License

This project is open source and available under the MIT License.



