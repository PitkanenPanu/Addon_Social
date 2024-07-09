// Luo chat-ikkuna
function createChatWindow() {
    const chatWindow = document.createElement('div');
    chatWindow.id = 'global-chat-window';
    chatWindow.style.cssText = `
      position: fixed;
      right: 20px;
      top: 20px;
      width: 300px;
      height: 400px;
      background: white;
      border: 1px solid #ccc;
      z-index: 10000;
    `;
    
    // Lisää tähän chat-ikkunan sisältö (otsikko, viestialue, syöttökenttä)
    
    document.body.appendChild(chatWindow);
  }
  
  // Hae nykyisen sivun URL
  const currentURL = window.location.href;
  
  // Luo chat-ikkuna ja yhdistä se palvelimeen
  createChatWindow();
  connectToServer(currentURL);
  
  function connectToServer(url) {
    // Toteuta tähän yhteys palvelimeen
    // Voit käyttää WebSocketia tai HTTP-pyyntöjä riippuen toteutustavastasi
  }