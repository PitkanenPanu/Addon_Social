document.addEventListener('DOMContentLoaded', function() {
    // Lataa tallennetut asetukset
    chrome.storage.sync.get(['username', 'position'], function(items) {
      document.getElementById('username').value = items.username || '';
      document.getElementById('position').value = items.position || 'bottomRight';
    });
  
    // Tallenna asetukset
    document.getElementById('save').addEventListener('click', function() {
      let username = document.getElementById('username').value;
      let position = document.getElementById('position').value;
      
      chrome.storage.sync.set({username: username, position: position}, function() {
        console.log('Asetukset tallennettu');
        // Lähetä viesti content scriptille
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {action: "updateSettings", username: username, position: position});
        });
      });
    });
  });