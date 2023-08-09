const changePlaybackRateFeature = {
  id: "change-playbackrate",
  title: "Change playbackrate",
  context: [
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
  ],
};

const manipulatePipFeature = {
  id: "manipulate-pip",
  title: "Manipulate pip",
  context: [
    "request",
    "exit",
  ],
};

const CHILD_MENU_ITEM_ID_DELIMITER = ":";

function buildChildMenuItemIdPrefix(feature) {
  return `${feature.id}${CHILD_MENU_ITEM_ID_DELIMITER}`
}

function throwUnknownFeatureError() {
  throw "unknown feature"
}

function detectFeature(menuItemId) {
  if (menuItemId.startsWith(changePlaybackRateFeature.id)) {
    return changePlaybackRateFeature;
  } else if (menuItemId.startsWith(manipulatePipFeature.id)) {
    return manipulatePipFeature;
  }
  throwUnknownFeatureError();
}

async function performFeature(tab, feature, menuItemId) {
  switch (feature.id) {
    case changePlaybackRateFeature.id:
      return await performChangePlaybackRate(tab, menuItemId)
      break;
    case manipulatePipFeature.id:
      return await performManipulatePip(tab, menuItemId)
      break;
    default:
      throwUnknownFeatureError();
  }
}

async function trigger(info) {
  const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  const feature = detectFeature(info.menuItemId);
  const resp = await performFeature(tab, feature, info.menuItemId)
  console.log(resp);
}

function removeFeaturePrefix(feature, value) {
  return value.replace(new RegExp(buildChildMenuItemIdPrefix(feature)), "");
}

function menuItemIdToRate(menuItemId) {
  return parseFloat(removeFeaturePrefix(changePlaybackRateFeature, menuItemId));
}

async function sendTabMessage(tab, feature, payload) {
  return await chrome.tabs.sendMessage(tab.id, {feature: feature.id, ...payload});
}

async function performChangePlaybackRate(tab, menuItemId) {
  const rate = menuItemIdToRate(menuItemId);
  return await sendTabMessage(tab, changePlaybackRateFeature, {rate});
}

function menuItemIdToPipManipulationType(menuItemId) {
  return removeFeaturePrefix(manipulatePipFeature, menuItemId)
}

async function performManipulatePip(tab, menuItemId) {
  const manipulationType = menuItemIdToPipManipulationType(menuItemId);
  return await sendTabMessage(tab, manipulatePipFeature, {manipulationType});
}

function buildChildMenuItemId(feature, value) {
  return `${buildChildMenuItemIdPrefix(feature)}${value}`
}

function registerFeature(feature) {
  const parent = chrome.contextMenus.create({
    title: feature.title,
    id: feature.id,
  });
  feature.context.forEach(item => {
    const v = `${item}`;
    chrome.contextMenus.create({
      title: v,
      id: buildChildMenuItemId(feature, v),
      parentId: parent,
    });
  });
}

chrome.contextMenus.onClicked.addListener(trigger);
chrome.runtime.onInstalled.addListener(() => {
  [
    changePlaybackRateFeature,
    manipulatePipFeature,
  ].forEach(registerFeature);
});

