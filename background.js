function injectContentScriptAndSendMessage(tab, message) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['libs/html2canvas.min.js', 'content-scripts/content.js']
  }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error injecting content script:', chrome.runtime.lastError);
      return;
    }
    
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
  } else if (request.action === "processCroppedImage") {
    // Here you would typically send the image to an AI service for processing
    // For this example, we'll simulate it with a timeout
    setTimeout(() => {
      const eventDetails = {
        title: "Sample Event",
        date: new Date().toISOString().split('T')[0], // Today's date
        time: "14:00",
        description: "This is a sample event created from a cropped image."
      };
      createCalendarEvent(eventDetails);
    }, 2000);
  }
  return true;
});

function createCalendarEvent(eventDetails) {
  // In a real-world scenario, you would use the Google Calendar API here
  // For this example, we'll just log the event details
  console.log("Creating calendar event:", eventDetails);
  
  // Simulate adding to calendar
  alert(`Event "${eventDetails.title}" added to calendar for ${eventDetails.date} at ${eventDetails.time}`);
}