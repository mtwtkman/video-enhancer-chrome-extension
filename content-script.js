chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch (request.feature) {
      case "change-playbackrate":
        changePlaybackRate(request.rate);
        break;
      case "manipulate-pip":
        manipulatePip(request.manipulationType);
        break;
      default:
        throw "unknown feature";
    }
    sendResponse({done: true});
  }
);

function findVideo() {
  return document.querySelector("video");
}

function changePlaybackRate(rate) {
    findVideo().playbackRate = rate;
}

function manipulatePip(manipulationType) {
  switch (manipulationType) {
    case "request":
      findVideo().requestPictureInPicture();
      break;
    case "exit":
      document.exitPictureInPicture();
      break;
    default:
      throw "unknown pip manipulation type";
  }
}
