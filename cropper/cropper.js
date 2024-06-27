let cropper;

console.log("Cropper script loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in cropper:", request);
  if (request.action === "initCropper") {
    initCropper(request.imageData);
    sendResponse({success: true});
  }
  return true;
});

function initCropper(imageData) {
  const image = document.getElementById('image');
  image.src = imageData;
  image.onload = () => {
    try {
      if (typeof Cropper !== 'undefined') {
        cropper = new Cropper(image, {
          aspectRatio: NaN,
          viewMode: 1,
        });
      } else {
        console.error('Cropper is not defined. Make sure the library is loaded correctly.');
      }
    } catch (error) {
      console.error('Error initializing Cropper:', error);
    }
  };
}

document.getElementById('cropBtn').addEventListener('click', () => {
  if (cropper && typeof cropper.getCroppedCanvas === 'function') {
    try {
      const croppedCanvas = cropper.getCroppedCanvas();
      const croppedImageData = croppedCanvas.toDataURL('image/png');
      chrome.runtime.sendMessage({action: "processCroppedImage", imageData: croppedImageData});
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  } else {
    console.error('Cropper is not properly initialized');
  }
});