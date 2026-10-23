document.getElementById('scrapeBtn').addEventListener('click', async () => {

    // Finds current browser tab
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Executes the script (data scrapping)

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

// Data scrapper function

function extractAmazonData() {

    // Gets product title

    const title = document.getElementById('productTitle')?.innerText?.trim() || "Title not found";

    // Extracting price (different page layouts will execute different fallback selectors)
    
    const priceElement = document.querySelector('.a-price .a-offscreen') || 
                        document.querySelector('#priceblock_ourprice') || 
                        document.querySelector('#corePrice_feature_div .a-offscreen');
                        
    const price = priceElement ? priceElement.innerText.trim() : "Price not found";

// Grab brand name
  const brandElement = document.querySelector('#bylineInfo') || document.querySelector('.po-brand .a-span9');
  let brand = brandElement ? brandElement.innerText.trim() : "Brand not found";
  
  // Clean the messy brand name
  brand = brand.replace(/^Visit the /, '').replace(/ Store$/, '').replace(/^Brand:\s*/, '');

    return { title, price, brand};
}