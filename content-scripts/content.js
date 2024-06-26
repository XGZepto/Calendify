chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "captureScreenshot") {
      html2canvas(document.body).then(canvas => {
        const imageData = canvas.toDataURL('image/png');
        chrome.runtime.sendMessage({action: "openCropper", imageData: imageData});
      });
    }
  });