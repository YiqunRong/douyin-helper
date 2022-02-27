import { updateUserLastActiveTime } from '../base/status';
import config from '../base/config';

const ALARM_SYNC_CONFIG = 'config:sync';

chrome.alarms.create(ALARM_SYNC_CONFIG, {
  periodInMinutes: 1,
});

chrome.alarms.onAlarm.addListener(({ name }) => {
  if (name === ALARM_SYNC_CONFIG) {
    config.sync();
  }
});

chrome.tabs.onCreated.addListener(() => {
  updateUserLastActiveTime(new Date());
});

chrome.action.onClicked.addListener(async () => {
  const url = chrome.runtime.getURL('options/index.html');
  const tabs = await chrome.tabs.query({
    windowId: chrome.windows.WINDOW_ID_CURRENT,
    url,
  });
  if (tabs.length) {
    chrome.tabs.update(tabs[0].id, {
      active: true,
    });
  } else {
    chrome.tabs.create({ url });
  }
});
