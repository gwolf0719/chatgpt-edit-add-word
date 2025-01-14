// ==UserScript==
// @name         ChatGPT 自動修正腳本
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  自動在編輯訊息時添加指定文字並確保提交時包含該文字，通過模擬使用者輸入避免被還原
// @author       James
// @match        *://chatgpt.com/*
// @match        *://chat.openai.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 要添加的文本
    const appendText = '---自動修正成合理化內容---';

    // 編輯按鈕的 aria-label
    const editButtonAriaLabel = '編輯訊息'; // 根據實際情況調整

    // 傳送按鈕的文字
    const sendButtonText = '傳送'; // 根據實際情況調整

    // 延遲時間（毫秒），根據實際情況調整
    const delayTime = 500;

    // 函式：等待元素出現
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
            return;
        }

        const observer = new MutationObserver((mutations, obs) => {
            const el = document.querySelector(selector);
            if (el) {
                callback(el);
                obs.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 函式：模擬按下 Enter 鍵
    function simulateEnterKey(element) {
        const eventInit = {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true
        };
        const enterKeyDown = new KeyboardEvent('keydown', eventInit);
        element.dispatchEvent(enterKeyDown);

        const enterKeyPress = new KeyboardEvent('keypress', eventInit);
        element.dispatchEvent(enterKeyPress);

        const enterKeyUp = new KeyboardEvent('keyup', eventInit);
        element.dispatchEvent(enterKeyUp);
    }

    // 函式：添加文本到 textarea 並模擬輸入
    function appendTextToTextarea(textarea, text) {
        textarea.value += `\n${text}`;
        // 觸發 input 事件
        const inputEvent = new Event('input', { bubbles: true, cancelable: true });
        textarea.dispatchEvent(inputEvent);

        // 觸發 change 事件
        const changeEvent = new Event('change', { bubbles: true, cancelable: true });
        textarea.dispatchEvent(changeEvent);

        // 模擬按下 Enter 鍵
        simulateEnterKey(textarea);
    }

    // 函式：重寫 textarea 的 value 屬性
    function redefineTextareaValue(textarea) {
        if (textarea.dataset.redefined) return;
        textarea.dataset.redefined = "true";

        const originalDescriptor = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
        if (!originalDescriptor) return;

        Object.defineProperty(textarea, 'value', {
            get: function() {
                return originalDescriptor.get.call(this);
            },
            set: function(val) {
                if (!val.includes(appendText)) {
                    val += `\n${appendText}`;
                }
                originalDescriptor.set.call(this, val);
                // 觸發 input 和 change 事件
                this.dispatchEvent(new Event('input', { bubbles: true }));
                this.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }

    // 函式：添加事件監聽器到編輯按鈕
    function addEditButtonListener(button) {
        if (button.dataset.listenerAdded) return;
        button.dataset.listenerAdded = "true";

        button.addEventListener('click', () => {
            // 延遲等待 textarea 渲染
            setTimeout(() => {
                const textareaSelector = 'textarea'; // 根據實際情況調整

                waitForElement(textareaSelector, (textarea) => {
                    redefineTextareaValue(textarea);
                    if (!textarea.value.includes(appendText)) {
                        appendTextToTextarea(textarea, appendText);
                        console.log('---自動修正--- 已添加到 textarea');
                    }

                    // 監控 textarea 的變化，防止自動還原
                    const textareaObserver = new MutationObserver(() => {
                        if (!textarea.value.includes(appendText)) {
                            appendTextToTextarea(textarea, appendText);
                            console.log('---自動修正--- 已重新添加到 textarea');
                        }
                    });

                    textareaObserver.observe(textarea, {
                        attributes: true,
                        attributeFilter: ['value'],
                        childList: false,
                        subtree: false
                    });
                });
            }, delayTime); // 根據實際情況調整延遲時間
        });
    }

    // 函式：添加事件監聽器到傳送按鈕
    function addSendButtonListener(button) {
        if (button.dataset.submitListenerAdded) return;
        button.dataset.submitListenerAdded = "true";

        // 使用捕獲階段的事件監聽器，優先於其他事件處理器執行
        button.addEventListener('click', (event) => {
            const textarea = document.querySelector('textarea'); // 根據實際情況調整
            if (textarea && !textarea.value.includes(appendText)) {
                appendTextToTextarea(textarea, appendText);
                console.log('---自動修正--- 已添加到 textarea（提交前）');
            }
        }, true); // 最後一個參數為 true，表示在捕獲階段處理事件
    }

    // 函式：尋找傳送按鈕
    function findSendButtons() {
        const buttons = document.querySelectorAll('button');
        const sendButtons = [];
        buttons.forEach(button => {
            const div = button.querySelector('div');
            if (div && div.innerText.trim() === sendButtonText) {
                sendButtons.push(button);
            }
        });
        return sendButtons;
    }

    // 函式：添加事件監聽器到傳送按鈕
    function monitorSendButtons() {
        const sendButtons = findSendButtons();
        sendButtons.forEach(addSendButtonListener);
    }

    // 函式：添加事件監聽器到編輯按鈕
    function monitorEditButtons() {
        const editButtonSelector = `button[aria-label="${editButtonAriaLabel}"]`;
        const editButtons = document.querySelectorAll(editButtonSelector);
        editButtons.forEach(addEditButtonListener);
    }

    // 監聽動態新增的元素
    function observeNewElements(callback) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // 元素節點
                            callback(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 主函式
    function main() {
        monitorEditButtons();
        monitorSendButtons();

        // 監聽動態新增的元素，並根據內容添加相應的事件監聽器
        observeNewElements((node) => {
            // 檢查是否為編輯按鈕
            if (node.matches(`button[aria-label="${editButtonAriaLabel}"]`)) {
                addEditButtonListener(node);
            }
            // 檢查子元素是否包含編輯按鈕
            node.querySelectorAll(`button[aria-label="${editButtonAriaLabel}"]`).forEach(addEditButtonListener);

            // 檢查是否為傳送按鈕
            const div = node.querySelector('div');
            if (node.matches('button') && div && div.innerText.trim() === sendButtonText) {
                addSendButtonListener(node);
            }
            // 檢查子元素是否包含傳送按鈕
            node.querySelectorAll('button').forEach(button => {
                const innerDiv = button.querySelector('div');
                if (innerDiv && innerDiv.innerText.trim() === sendButtonText) {
                    addSendButtonListener(button);
                }
            });
        });
    }

    // 執行主函式
    main();

})();
