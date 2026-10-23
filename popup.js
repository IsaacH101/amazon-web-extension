document.getElementById('scrapeBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Execute script on the current Amazon tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: extractAmazonData
  }, (results) => {
    if (results && results[0]) {
      const data = results[0].result;
      document.getElementById('result').innerText = 
        `Title:\n${data.title}\n\nPrice:\n${data.price}`;
    } else {
      document.getElementById('result').innerText = "Could not extract data.";
    }
  });
});

// This function runs inside the Amazon webpage context
function extractAmazonData() {
  const title = document.getElementById('productTitle')?.innerText?.trim() || "Title not found";
  
  // Amazon uses different selectors for prices depending on the layout
  const priceElement = document.querySelector('.a-price .a-offscreen') || 
                       document.querySelector('#priceblock_ourprice') || 
                       document.querySelector('#corePrice_feature_div .a-offscreen');
                       
  const price = priceElement ? priceElement.innerText.trim() : "Price not found";

  return { title, price };
}