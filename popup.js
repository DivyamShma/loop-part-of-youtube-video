document.addEventListener('DOMContentLoaded', function() {
    const setButton = document.getElementById('setButton');
    const resetButton = document.getElementById('resetButton');
    const statusElement = document.getElementById('status');
  

    function sendMessageToContentScript(message, callback) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if (tabs.length === 0) {
            statusElement.textContent = 'No active tab found.';
            return;
          }
      
          chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
            if (chrome.runtime.lastError) {
              console.error('Chrome runtime error:', chrome.runtime.lastError.message);
              if (chrome.runtime.lastError.message.includes("Receiving end does not exist")) {
                statusElement.textContent = 'Please refresh the YouTube page.';
              } else {
                statusElement.textContent = 'Error: ' + chrome.runtime.lastError.message;
              }
            } else {
              callback(response);
            }
          });
        });
      }

    function timeToSeconds(hours, minutes, seconds) {
      return hours * 3600 + minutes * 60 + seconds;
    }
  
    function getTimeInput(prefix) {
      const hours = parseInt(document.getElementById(prefix + 'Hours').value) || 0;
      const minutes = parseInt(document.getElementById(prefix + 'Minutes').value) || 0;
      const seconds = parseInt(document.getElementById(prefix + 'Seconds').value) || 0;
      return timeToSeconds(hours, minutes, seconds);
    }
  
    setButton.addEventListener('click', function() {
      const startTime = getTimeInput('start');
      const endTime = getTimeInput('end');
  
      if (isNaN(startTime) || isNaN(endTime)) {
        statusElement.textContent = 'Please enter valid numbers for all fields.';
        return;
      }
  
      sendMessageToContentScript({
        action: "setTimes",
        start: startTime,
        end: endTime
      }, function(response) {
        statusElement.textContent = 'Times set successfully!';
      });
    });
  

    resetButton.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if (tabs.length === 0) {
            statusElement.textContent = 'No active tab found.';
            return;
          }
    
          sendMessageToContentScript({
            action: "resetTimes"
          }, function(response) {
            statusElement.textContent = 'Times reset successfully!';
          });
        });


    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "videoLoaded") {
        statusElement.textContent = 'New video detected. Please set times.';
      }
    });
  });
});