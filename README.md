# ChatGPT Auto-Repair Script

![Logo](https://via.placeholder.com/150)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Steps](#steps)
- [Configuration](#configuration)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Introduction

**ChatGPT Auto-Repair Script** is a Tampermonkey user script designed to enhance your ChatGPT experience. This script automatically appends a predefined correction text (`---自動修正---`) to your messages when you edit them, ensuring that the correction is included upon submission. This is particularly useful for maintaining consistency and reducing manual effort when managing your messages.

## Features

- **Automatic Text Addition**: Automatically appends `---自動修正---` to the end of your messages when editing.
- **Submission Assurance**: Ensures that the appended text is included when you submit your message.
- **User Input Simulation**: Simulates user actions, such as pressing the Enter key, to interact seamlessly with ChatGPT's frontend framework.
- **Dynamic Monitoring**: Continuously monitors the textarea to prevent automatic removal of the appended text.
- **Compatibility**: Works with both `chatgpt.com` and `chat.openai.com`.

## Installation

### Prerequisites

- **Browser Extension**: Install [Tampermonkey](https://www.tampermonkey.net/) in your preferred browser. Tampermonkey is available for Chrome, Firefox, Edge, Safari, and other major browsers.

### Steps

1. **Install Tampermonkey**:
   - Visit the [Tampermonkey website](https://www.tampermonkey.net/) and install the extension for your browser.

2. **Add the Script**:
   - Click on the Tampermonkey icon in your browser's toolbar.
   - Select **Dashboard**.
   - Click on the **+** (Add a new script) button.
   - In the editor that appears, remove any default template code.
   - Add the following metadata to reference your `code.js` hosted on GitHub:

     ```markdown
     // ==UserScript==
     // @name         ChatGPT Auto-Repair Script
     // @namespace    http://tampermonkey.net/
     // @version      1.7
     // @description  Automatically appends correction text to ChatGPT messages upon editing and ensures inclusion upon submission.
     // @author       Your Name
     // @match        *://chatgpt.com/*
     // @match        *://chat.openai.com/*
     // @grant        none
     // @require      https://raw.githubusercontent.com/yourusername/yourrepository/main/code.js
     // ==/UserScript==
     ```

   - Replace `https://raw.githubusercontent.com/yourusername/yourrepository/main/code.js` with the actual URL to your `code.js` file in your GitHub repository.
   - Click **File** > **Save** or press `Ctrl+S` to save the script.

## Configuration

- **Edit Button ARIA Label**: Ensure that the `editButtonAriaLabel` in your script matches the actual `aria-label` of the "Edit Message" button in ChatGPT.
- **Send Button Text**: Ensure that the `sendButtonText` in your script matches the text content of the "Send" button in ChatGPT.
- **Delay Time**: Adjust the `delayTime` variable if necessary to accommodate different loading times of the textarea.

## Usage

1. **Editing a Message**:
   - Navigate to [ChatGPT](https://chat.openai.com/) and locate the message you wish to edit.
   - Click on the **Edit Message** button.
   - The script will automatically append `---自動修正---` to the end of the message in the textarea.

2. **Submitting a Message**:
   - After editing, click the **Send** button.
   - The script ensures that `---自動修正---` is included in the submitted message.

3. **Automatic Monitoring**:
   - The script continuously monitors the textarea. If the appended text is removed automatically, the script will re-add it to maintain consistency.

## Troubleshooting

- **Script Not Running**:
  - Ensure that Tampermonkey is installed and enabled in your browser.
  - Verify that the script is enabled in the Tampermonkey dashboard.
  - Check the browser console for any errors by pressing `F12` and navigating to the **Console** tab.

- **Buttons Not Recognized**:
  - Verify that the `aria-label` for the edit button and the text for the send button in the script match those on the ChatGPT interface.
  - Update the `editButtonAriaLabel` and `sendButtonText` variables in your script accordingly.

- **Delay Adjustments**:
  - If the appended text does not appear, try increasing the `delayTime` in the script to allow more time for the textarea to render.

## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, please open an issue or submit a pull request on the [GitHub repository](https://github.com/yourusername/yourrepository).

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

*Disclaimer: This script is intended for personal use. Please ensure that its usage complies with OpenAI's terms of service. The author is not responsible for any misuse or damages resulting from the use of this script.*
