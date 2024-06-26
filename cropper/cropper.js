let cropper;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "initCropper") {
    const image = document.getElementById('image');
    image.src = request.imageData;
    image.onload = () => {
      cropper = new Cropper(image, {
        aspectRatio: NaN,
        viewMode: 1,
      });
    };
  }
});

document.getElementById('cropBtn').addEventListener('click', () => {
  const croppedCanvas = cropper.getCroppedCanvas();
  const croppedImageData = croppedCanvas.toDataURL('image/png');
  
  // Here, you would send the croppedImageData to your AI service for processing
  // For now, we'll just log it
  console.log("Cropped image data:", croppedImageData);
  
  // TODO: Implement AI processing and Google Calendar integration
});