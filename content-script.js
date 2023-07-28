chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    document.querySelector("video").playbackRate = request.changePlaybackRate;
    sendResponse({done: true});
  }
);
