const rates = [
  0.1,
  0.25,
  0.5,
  1,
  1.5,
  2,
  2.5,
  3,
  3.5,
  4,
  4.5,
  5,
];

chrome.contextMenus.onClicked.addListener(changePlaybackRate);

async function changePlaybackRate(info) {
  const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true });
  const rate = parseFloat(info.menuItemId);
  const resp = await chrome.tabs.sendMessage(tab.id, { changePlaybackRate: rate });
  console.log(resp);
}

chrome.runtime.onInstalled.addListener(function () {
  rates.forEach(rate => {
    const s = JSON.stringify(rate);
    chrome.contextMenus.create({
      title: s,
      id: s,
    });
  });
});
