# WIP

# Event Screenshotter Chrome Extension

## Overview

Event Screenshotter is a Chrome extension that allows users to capture and crop images of event details from web pages, then automatically generate calendar events based on the captured information. The extension uses image processing and AI to extract event details, and provides options to add the event to Google Calendar or download it as an ICS file.

## Features

- Screenshot capture of the current visible area of a web page
- Image cropping functionality
- AI-powered event detail extraction (simulated in current version)
- Google Calendar integration
- ICS file generation for calendar events

## Setup

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/event-screenshotter.git
   ```

2. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" and select the project directory

## Usage

1. Click on the extension icon in the Chrome toolbar to capture the current visible area of the web page.
2. Use the cropping tool to select the relevant event information.
3. Click "Crop and Process" to analyze the image.
4. Review the extracted event details.
5. Choose to add the event to Google Calendar or download as an ICS file.

## Future Improvements

- Implement actual AI-powered event detail extraction
- Enhance user interface and experience
- Add support for more calendar services

## Credits

This project uses the following open-source libraries:

- [Cropper.js](https://github.com/fengyuanchen/cropperjs) - JavaScript image cropper
- [html2canvas](https://github.com/niklasvh/html2canvas) - Screenshots with JavaScript

## License

[MIT License](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any problems or have any questions, please open an issue in this repository.
