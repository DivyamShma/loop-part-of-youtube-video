# loop-part-of-youtube-video

This project was made mainly for my own learning experience and comfort, but anyone is allowed to use it or contribute to it.Why I made this and not just downloaded one of the many existing ones, well, firstly, because I don't trust them to either work or with my privacy (probably not a concern but still), and secondly, it seemed interesting to make one myself as I was able to learn something new, and most of all, I could customize it to any level; any amount of features could be added, not just limiting to looping videos, and on the contrary, I could also keep it minimal and not include anything other than looping videos. Currently, as of 8th August 2024, this is minimal, but who knows, someday I may visit this again to make additions.

## Short description: 

This will add a Chrome extension to your device locally (because actually publishing costs $$) and will allow you to loop between an interval set by you in your YouTube video. To run this, download all of these files in a folder and then go to chrome://extensions/, turn on developer mode, click on load upacked and select your folder with the files. 

## Description:

### manifest.json:- 

The manifest.json file is a necessary file for any Chrome extension to exist. 

It basically provides the Chrome extensions to set their name, version, description, display icons, permissions needed, what all sites and links it accepts, and what to expect when on those sites. in the file: `"permissions": ["activeTab"]` asks for the permission to work on active tabs or the tabs currently in use.

In the actions, it tells to run the icons according to their sizes and run the popup.html file when clicked on.

### popup.html:-

the file that will be displayed to the user

takes 3 inputs each for starting and ending between hour, minutes, and seconds. All values need not be set because it will take the default as 0.
has a status para as the end to print any error messages.

This calls the popup. js


### popup.js:-
the controlling code behind the form getting the inputs ready and performing checks.

`document.addEventListener('DOMContentLoaded', function())` basically says that we should only start the script when the DOM has been completely loaded because we do not want to run it when it's partially loaded because that may cause unnecessary errors. This is basically listening to the whole document for the specific event, and when that happens, we define a function without a name or anonymous function to execute when this happens.

In the next function `sendMessageToContentScript` we just check if there are any active tabs for YouTube, and if there is some error message, we add it to the popup.html paragraph tag with id status.

Next, we just take the input with default 0 and convert the hour, minute, and second to seconds.

Now there are two buttons set to reset.We set up eventlisteners for that in the same manner as for the previous function, just this time instead of a load event, we are listening for click events, and if any of the buttons are pressed, their code runs.

If reset is pressed, we simply reset the interval values to 0 and infinity and close the loop.

If set is pressed, we check if any value is actually entered, and if they are, we get the `starttime` and `endtime` from it.

At the end, just a checker for if the video is changed, then we need to set the timings for the new video.

### content.js :-

Now this is where the magic happens.

This is the actual part where the video timings get manipulated.

The function `checkVideoTime` simply checks if the current time of the video is between that interval, and if it exceeds or preceeds it, it gets reset to the `starttime`.

`startChecking()`: This function starts a periodic check using `setInterval`.

`if (checkInterval)`: Checks if `checkInterval` is already set (i.e., not `null` or `undefined`).

`clearInterval(checkInterval)`: If checkInterval is already set, it clears (stops) the interval to prevent multiple intervals running simultaneously.

`checkInterval = setInterval(checkVideoTime, 1000);`: Sets checkInterval to a new interval created by setInterval. It calls the `checkVideoTime` function every 1000 milliseconds (1 second).

`stopChecking()`: This function stops the periodic check started by `startChecking()`.

`if (checkInterval)`: Checks if checkInterval is set (not `null` or `undefined`).

`clearInterval(checkInterval)`: Clears (stops) the interval timer referenced by `checkInterval`.

`checkInterval = null;`: Resets checkInterval to `null`, indicating that no interval is currently active.

`if (request.action === "setTimes") { ... }`: Handles messages where request.action is `"setTimes"`. It sets `startTime` and `endTime` based on the received `request.start` and `request.end` values, starts the interval check (`startChecking()`), and sends a response confirming success.

`else if (request.action === 'resetTimes') { ... }`: Handles messages where request.action is `"resetTimes"`. 

It resets `startTime` to `0` and `endTime` to `Infinity`, stops the interval check (`stopChecking()`), and sends a response confirming success.

`sendResponse({status: ...})`: Sends a response back to the message sender, indicating the status of the operation (either `"Times set successfully"` or `"Time reset successfully"`).

`return true;`: Indicates that the extension will send a response asynchronously using `sendResponse`.

And that concludes this Chrome extension.
