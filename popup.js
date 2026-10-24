document.getElementById('scrapeBtn').addEventListener('click', async () => {

    // Finds current browser tab

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Executes the script (data scraping)

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractAmazonData
    }, (results) => {

        // Displaying the info in the extension

        if (results && results[0]) {
            const data = results[0].result;
            document.getElementById('result').innerText = 
            `Brand: ${data.brand}\n\nTitle:\n${data.title}\n\nPrice:\n${data.price}`;
        } else {
            document.getElementById('result').innerText = "Could not extract data.";
        }
    });
});

// Data scraper function

function extractAmazonData() {

    // Gets product title

    const title = document.getElementById('productTitle')?.innerText?.trim() || "Title not found";

    // Extracting price

    const priceElement = document.querySelector('.a-price .a-offscreen') || 
                        document.querySelector('#priceblock_ourprice') || 
                        document.querySelector('#corePrice_feature_div .a-offscreen');
                        
    const price = priceElement ? priceElement.innerText.trim() : "Price not found";

    // Grabs the product brand

    let brand = (
        document.querySelector('.po-brand .a-span9') || 
        document.querySelector('.po-brand span')
    )?.innerText.trim() || 'N/A';
  
    // Clean up brand format

    brand = brand.replace(/^Brand:\s*/i, '');

    return { title, price, brand };
}