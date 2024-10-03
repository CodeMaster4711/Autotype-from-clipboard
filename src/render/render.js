const { clipboard, nativeImage } = require('electron');

let clipboardHistory = [];
let isRunning = false;

document.getElementById('start').addEventListener('click', () => {
  isRunning = true;
  console.log('Program started');
});

document.getElementById('stop').addEventListener('click', () => {
  isRunning = false;
  console.log('Program stopped');
});

document.addEventListener('keydown', (event) => {
  if (isRunning) {
    if (event.ctrlKey && event.key === 'c') {
      const clipboardContent = {
        text: clipboard.readText(),
        html: clipboard.readHTML(),
        image: clipboard.readImage()
      };

      if (clipboardContent.text || clipboardContent.html || !clipboardContent.image.isEmpty()) {
        clipboardHistory.push(clipboardContent);
        updateClipboardList();
      }
    }

    if (event.ctrlKey && event.shiftKey && event.key === 'v') {
      const lastContent = clipboardHistory[clipboardHistory.length - 1];
      if (lastContent) {
        if (lastContent.text) {
          document.execCommand('insertText', false, lastContent.text);
        } else if (lastContent.html) {
          document.execCommand('insertHTML', false, lastContent.html);
        } else if (!lastContent.image.isEmpty()) {
          const img = new Image();
          img.src = lastContent.image.toDataURL();
          document.body.appendChild(img);
        }
      }
    }
  }
});

function updateClipboardList() {
  const clipboardList = document.getElementById('clipboardList');
  clipboardList.innerHTML = ''; // Clear the list

  clipboardHistory.forEach(content => {
    const listItem = document.createElement('li');

    if (content.text) {
      const textItem = document.createElement('p');
      textItem.textContent = `Text: ${content.text}`;
      listItem.appendChild(textItem);
    }

    if (content.html) {
      const htmlItem = document.createElement('p');
      htmlItem.innerHTML = `HTML: ${content.html}`;
      listItem.appendChild(htmlItem);
    }

    if (!content.image.isEmpty()) {
      const imageItem = document.createElement('img');
      imageItem.src = content.image.toDataURL();
      listItem.appendChild(imageItem);
    }

    clipboardList.appendChild(listItem);
  });
}