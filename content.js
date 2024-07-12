let chatSettings = {
  username: 'Anonyymi',
  position: 'bottomRight',
  isVisible: true
};

let chatHistory = [];

// Lataa chat-historia ja asetukset, kun sivu latautuu
chrome.storage.local.get(['chatHistory', 'chatSettings'], function(result) {
  if (result.chatHistory) {
    chatHistory = result.chatHistory;
  }
  if (result.chatSettings) {
    chatSettings = {...chatSettings, ...result.chatSettings};
  }
  if (chatSettings.isVisible) {
    createChatWindow();
  } else {
    createToggleButton();
  }
});

// Kuuntele viestejä popup.js:ltä
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "updateSettings") {
    chatSettings.username = request.username;
    chatSettings.position = request.position;
    updateChatPosition();
    saveChatSettings();
  }
});

function createToggleButton() {
  const toggleButton = document.createElement('button');
  toggleButton.id = 'chat-toggle-button';
  toggleButton.textContent = 'Chat';
  toggleButton.addEventListener('click', showChat);
  document.body.appendChild(toggleButton);
  updateToggleButtonPosition();
}

function showChat() {
  document.getElementById('chat-toggle-button').remove();
  createChatWindow();
  chatSettings.isVisible = true;
  saveChatSettings();
}

function hideChat() {
  document.getElementById('global-chat-window').remove();
  createToggleButton();
  chatSettings.isVisible = false;
  saveChatSettings();
}

function createChatWindow() {
  const chatWindow = document.createElement('div');
  chatWindow.id = 'global-chat-window';
  chatWindow.innerHTML = `
    <div class="chat-header">
      Chat: ${window.location.hostname}
      <button class="chat-close-button">×</button>
    </div>
    <div class="chat-messages"></div>
    <div class="chat-input-container">
      <input type="text" class="chat-input" placeholder="Kirjoita viesti...">
      <button class="chat-send-button">Lähetä</button>
    </div>
  `;
  document.body.appendChild(chatWindow);

  document.querySelector('.chat-close-button').addEventListener('click', hideChat);

  updateChatPosition();
  displayChatHistory();

  const inputElement = document.querySelector('.chat-input');
  const sendButton = document.querySelector('.chat-send-button');

  function sendMessage() {
    const messageText = inputElement.value.trim();
    if (messageText) {
      addMessage(chatSettings.username, messageText);
      inputElement.value = '';
    }
  }

  inputElement.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  sendButton.addEventListener('click', sendMessage);
}

function addMessage(username, text) {
  const message = {
    username: username,
    text: text,
    timestamp: new Date().toISOString()
  };
  chatHistory.push(message);
  displayMessage(message);
  saveChatHistory();
}

function displayMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.textContent = `${message.username} (${new Date(message.timestamp).toLocaleTimeString()}): ${message.text}`;
  document.querySelector('.chat-messages').appendChild(messageElement);
}

function displayChatHistory() {
  const chatMessages = document.querySelector('.chat-messages');
  chatMessages.innerHTML = ''; // Tyhjennä aiemmat viestit
  chatHistory.forEach(displayMessage);
}

function saveChatHistory() {
  chrome.storage.local.set({chatHistory: chatHistory}, function() {
    console.log('Chat-historia tallennettu');
  });
}

function updateChatPosition() {
  const element = document.getElementById('global-chat-window') || document.getElementById('chat-toggle-button');
  if (element) {
    element.style.top = 'auto';
    element.style.bottom = 'auto';
    element.style.left = 'auto';
    element.style.right = 'auto';

    switch(chatSettings.position) {
      case 'bottomRight':
        element.style.bottom = '20px';
        element.style.right = '20px';
        break;
      case 'bottomLeft':
        element.style.bottom = '20px';
        element.style.left = '20px';
        break;
      case 'topRight':
        element.style.top = '20px';
        element.style.right = '20px';
        break;
      case 'topLeft':
        element.style.top = '20px';
        element.style.left = '20px';
        break;
    }
  }
}

function updateToggleButtonPosition() {
  const toggleButton = document.getElementById('chat-toggle-button');
  if (toggleButton) {
    toggleButton.style.position = 'fixed';
    toggleButton.style.zIndex = '10001';
    updateChatPosition();
  }
}

function saveChatSettings() {
  chrome.storage.local.set({chatSettings: chatSettings}, function() {
    console.log('Chat-asetukset tallennettu');
  });
}

if (chatSettings.isVisible) {
  createChatWindow();
} else {
  createToggleButton();
}