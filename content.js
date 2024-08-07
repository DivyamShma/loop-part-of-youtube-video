// Global variables to store time settings
let startTime = 0;
let endTime = 0;
let checkInterval = null;

// Function to check and reset video time
function checkVideoTime() {
  const video = document.getElementsByTagName('video')[0];
  if (video && (video.currentTime < startTime || video.currentTime > endTime)) {
    video.currentTime = startTime;
  }
}

function startChecking() {
    if (checkInterval) {
      clearInterval(checkInterval);
    }
    checkInterval = setInterval(checkVideoTime, 1000);
  }
  
  function stopChecking() {
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
  }
  
// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "setTimes") {
      startTime = request.start;
      endTime = request.end;
      startChecking();

      sendResponse({status: "Times set successfully"});
    }
    else if (request.action === 'resetTimes'){
        startTime = 0;
        endTime = Infinity;
        stopChecking();
        sendResponse({status: "Time reset successfully"});
    }
    // Return true to indicate you wish to send a response asynchronously
    return true;
  });

  // Notify popup when a new video loads
document.addEventListener('yt-navigate-finish', function() {
    chrome.runtime.sendMessage({action: "videoLoaded"});
  });