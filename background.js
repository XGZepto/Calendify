chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, {action: "captureScreenshot"});
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "openCropper") {
      chrome.tabs.create({url: 'cropper/cropper.html'}, (newTab) => {
        chrome.tabs.sendMessage(newTab.id, {action: "initCropper", imageData: request.imageData});
      });
    }
  });