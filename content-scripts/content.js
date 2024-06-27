console.log("Content script loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content script:", request);
  if (request.action === "captureScreenshot") {
    if (typeof html2canvas === 'undefined') {
      console.error('html2canvas is not defined. Make sure the library is properly loaded.');
      sendResponse({error: 'html2canvas not loaded'});
      return true;
    }
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    html2canvas(document.body, {
      logging: false,
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: false,
      width: viewportWidth,
      height: viewportHeight,
      windowWidth: viewportWidth,
      windowHeight: viewportHeight,
      x: window.scrollX,
      y: window.scrollY
    }).then(canvas => {
      const imageData = canvas.toDataURL('image/png');
      chrome.runtime.sendMessage({action: "openCropper", imageData: imageData});
      sendResponse({success: true});
    }).catch(error => {
      console.error('Error in html2canvas:', error);
      sendResponse({error: 'Failed to capture screenshot'});
    });
    
    return true; // Indicates that the response is sent asynchronously
  }
});