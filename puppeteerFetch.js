// puppeteerFetch.js
import { launch } from 'puppeteer';
let browser
async function fetchJsonData(pos) {
    if (!browser) {
        browser = await launch();
    }

    const page = await browser.newPage();

    // Go to the JSON data URL
    await page.goto(`https://connect4.gamesolver.org/solve?pos=${pos}`, { waitUntil: 'networkidle0' });

    // Extract the JSON directly from the page content
    const jsonData = await page.evaluate(() => {
        return JSON.parse(document.querySelector('pre').innerText);
    });

    return jsonData;
}

// Call fetchJsonData multiple times
// ...

// Close the browser when you're done
async function closeBrowser() {
    if (browser) {
        await browser.close();
    }
}

export default fetchJsonData;
