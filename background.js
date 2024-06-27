function injectContentScriptAndSendMessage(tab, message) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['libs/html2canvas.min.js', 'content-scripts/content.js']
  }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error injecting content script:', chrome.runtime.lastError);
      return;
    }
    
    // Wait a bit to ensure the script is fully loaded
    setTimeout(() => {
      chrome.tabs.sendMessage(tab.id, message, response => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError);
        } else {
          console.log('Message sent successfully:', response);
        }
      });
    }, 200);
  });
}

chrome.action.onClicked.addListener((tab) => {
  injectContentScriptAndSendMessage(tab, {action: "captureScreenshot"});
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openCropper") {
    chrome.tabs.create({url: 'cropper/cropper.html'}, (newTab) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (tabId === newTab.id && info.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          setTimeout(() => {
            chrome.tabs.sendMessage(newTab.id, {action: "initCropper", imageData: request.imageData});
          }, 500);
        }
      });
    });
  }
  return true;
});