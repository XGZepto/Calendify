import { parseEventImage } from '../utils/api-utils.js';
import { initializeGoogleCalendar, authenticateAndAddEvent } from '../utils/calendar-utils.js';
import { generateICSFile } from '../utils/ics-utils.js';

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
                    minContainerWidth: 100,
                    minContainerHeight: 100,
                    responsive: true,
                    restore: false,
                    center: false,
                    highlight: false,
                    cropBoxMovable: true,
                    cropBoxResizable: true,
                    toggleDragModeOnDblclick: false,
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
          
          showConfirmationDialog(croppedImageData);
      } catch (error) {
          console.error('Error cropping image:', error);
      }
  } else {
      console.error('Cropper is not properly initialized');
  }
});

function showConfirmationDialog(croppedImageData) {
  const dialog = document.createElement('div');
  dialog.className = 'dialog';
  
  const previewContainer = document.createElement('div');
  previewContainer.className = 'preview-container';

  const previewTitle = document.createElement('h2');
  previewTitle.className = 'preview-title';
  previewTitle.textContent = 'Cropped Image Preview';
  
  const preview = document.createElement('img');
  preview.className = 'preview-image';
  preview.src = croppedImageData;
  
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'button-container';
  
  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'button confirm-button';
  confirmBtn.textContent = 'Confirm';
  confirmBtn.addEventListener('click', () => {
      showLoadingAnimation(dialog);
      processImage(croppedImageData, dialog);
  });
  
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'button cancel-button';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', () => {
      dialog.remove();
  });
  
  buttonContainer.appendChild(confirmBtn);
  buttonContainer.appendChild(cancelBtn);
  
  previewContainer.appendChild(previewTitle);
  previewContainer.appendChild(preview);
  previewContainer.appendChild(buttonContainer);
  dialog.appendChild(previewContainer);
  document.body.appendChild(dialog);
}

function showLoadingAnimation(dialog) {
  dialog.innerHTML = '';
  const loading = document.createElement('div');
  loading.className = 'loading';
  loading.style.display = 'block';
  
  const spinner = document.createElement('div');
  spinner.className = 'loading-spinner';
  
  const loadingText = document.createElement('p');
  loadingText.textContent = 'Processing image...';
  
  loading.appendChild(spinner);
  loading.appendChild(loadingText);
  dialog.appendChild(loading);
}

function processImage(imageData, dialog) {
  const eventDetails = {
      title: "AI Generated Event",
      date: new Date().toISOString().split('T')[0],
      time: "14:00",
      description: "This is an AI-generated event based on the cropped image."
  };
  showLoadingAnimation(dialog);
  try {
    // const eventDetails = await parseEventImage(imageData);
    showResultPreview(eventDetails, dialog);
  } catch (error) {
    console.error('Error processing image:', error);
    showErrorMessage(dialog);
  }
}

function showResultPreview(eventDetails, dialog) {
  dialog.innerHTML = '';
  const resultPreview = document.createElement('div');
  resultPreview.className = 'result-preview';
  resultPreview.style.display = 'block';

  const title = document.createElement('h3');
  title.textContent = 'Generated Event Details';

  const details = document.createElement('p');
  details.innerHTML = `
      <strong>Title:</strong> ${eventDetails.title}<br>
      <strong>Date:</strong> ${eventDetails.date}<br>
      <strong>Time:</strong> ${eventDetails.time}<br>
      <strong>Description:</strong> ${eventDetails.description}
  `;

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'result-buttons';

  const addToCalendarBtn = document.createElement('button');
  addToCalendarBtn.textContent = 'Add to Google Calendar';
  addToCalendarBtn.addEventListener('click', () => {
    openGoogleCalendarEvent(eventDetails);
  });

  const downloadICSBtn = document.createElement('button');
  downloadICSBtn.textContent = 'Download ICS File';
  downloadICSBtn.addEventListener('click', () => {
    generateICSFile(eventDetails);
  });

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.addEventListener('click', () => {
      dialog.remove();
  });

  buttonContainer.appendChild(addToCalendarBtn);
  buttonContainer.appendChild(downloadICSBtn);
  buttonContainer.appendChild(closeBtn);

  resultPreview.appendChild(title);
  resultPreview.appendChild(details);
  resultPreview.appendChild(buttonContainer);
  dialog.appendChild(resultPreview);
}

function showErrorMessage(dialog) {
  dialog.innerHTML = '';
  const errorMessage = document.createElement('div');
  errorMessage.className = 'result-preview';
  errorMessage.style.display = 'block';

  const title = document.createElement('h3');
  title.textContent = 'Unable to Generate Event';

  const message = document.createElement('p');
  message.textContent = 'Sorry, we couldn\'t generate a calendar event from this image.';

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.addEventListener('click', () => {
      dialog.remove();
  });

  errorMessage.appendChild(title);
  errorMessage.appendChild(message);
  errorMessage.appendChild(closeBtn);
  dialog.appendChild(errorMessage);
}
