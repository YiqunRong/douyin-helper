import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@douyinfe/semi-ui";
import { IconDownloadStroked, IconSettingStroked } from "@douyinfe/semi-icons";

import { Video } from "../../../../base/functions/downloadVideo";

function downloadVideoFile(filename: string, url: string) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob";
  return new Promise((resolve, reject) => {
    xhr.onload = function () {
      var urlCreator = window.URL || window.webkitURL;
      var fileUrl = urlCreator.createObjectURL(this.response);
      var tag = document.createElement("a");
      tag.href = fileUrl;
      tag.target = "_blank";
      tag.download = filename;
      document.body.appendChild(tag);
      tag.click();
      document.body.removeChild(tag);
      resolve({});
    };
    xhr.onerror = (err) => {
      alert("Failed to download video file");
      reject({});
    };
    xhr.send();
  });
}

export default function Popup() {
  const [video, setVideo] = useState<Video>();
  const [videoDownloading, setVideoDownloading] = useState(false);
  const port = useRef<chrome.runtime.Port>();

  useEffect(() => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      port.current = chrome.tabs.connect(tabs[0].id || 0, { name: "popup" });
      port.current.onMessage.addListener((msg) => {
        setVideo(msg.video);
      });
    });
    return () => {
      port.current?.disconnect();
    };
  }, []);

  const downloadVideo = useCallback(async () => {
    if (!video) {
      return;
    }
    setVideoDownloading(true);
    await downloadVideoFile(video.filename, video.url);
    setVideoDownloading(false);
  }, [video]);

  return (
    <div className="flex flex-col gap-y-2 p-3 w-48">
      <Button
        icon={<IconDownloadStroked />}
        block={true}
        size="large"
        disabled={!video}
        onClick={() => downloadVideo()}
      >
        {videoDownloading && "下载中..."}
        {!videoDownloading && (video ? "下载当前视频" : "未检测到视频")}
      </Button>
      <Button
        icon={<IconSettingStroked />}
        block={true}
        type="tertiary"
        onClick={openOptionsPage}
      >
        选项
      </Button>
    </div>
  );
}

async function openOptionsPage() {
  const baseUrl = chrome.runtime.getURL("main/index.html");
  const url = baseUrl + "#/options";
  const tabs = await chrome.tabs.query({
    windowId: chrome.windows.WINDOW_ID_CURRENT,
    url: baseUrl + "*",
  });
  for (const tab of tabs) {
    if (tab.url?.includes(url)) {
      chrome.tabs.update(tab.id || 0, {
        active: true,
      });
      return;
    }
  }
  chrome.tabs.create({ url });
}
