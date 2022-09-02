import { DefaultOptions, Options, TrackerConfig } from "../type/index";
import { initHistoryEvent } from "../utils/index";

const MouseEventList: string[] = [
  "click",
  "dblclick",
  "contextmenu",
  "mousedown",
  "mouseup",
  "mouseenter",
  "mouseout",
  "mouseover",
];
export default class Tracker {
  private version: string | undefined;
  public data: Options;

  constructor(options: Options) {
    this.data = { ...this.initDef(), ...options };
    this.installInnerTracker();
  }

  private initDef(): DefaultOptions {
    this.version = TrackerConfig.version;

    return {
      sdkVersion: this.version,
      historyTracker: false,
      hashTracker: false,
      domTracker: false,
      jsError: false,
    };
  }

  private installInnerTracker() {
    if (this.data.historyTracker) {
      initHistoryEvent();
      this.captureEvents(["pushState", "replaceState"], "history-pv");
    }
    if (this.data.hashTracker) {
      this.captureEvents(["hashchange"], "hash-pv");
    }
    if (this.data.domTracker) {
      this.reportTargetKey();
    }
    if (this.data.jsError) {
      this.reportJSErrorEvent();
    }
  }

  private captureEvents(eventList: string[], key: string) {
    eventList.forEach((event) => {
      window.addEventListener(event, () => {
        this.reportTracker({ event, key });
      });
    });
  }

  private reportTargetKey() {
    MouseEventList.forEach((event) => {
      window.addEventListener(event, (e) => {
        const target = e.target as HTMLElement;
        const targetKey = target.getAttribute("target-key");
        if (targetKey) {
          this.reportTracker({ event, targetKey });
        }
      });
    });
  }

  private reportJSErrorEvent() {
    window.addEventListener("error", (event) => {
      this.reportTracker({
        event: "js-error",
        targetKey: "errormessage",
        message: event.message,
      });
    });
    window.addEventListener("unhandledrejection", (event) => {
      event.promise.catch((error) => {
        this.reportTracker({
          event: "promise-error",
          targetKey: "errormessage",
          message: error,
        });
      });
    });
  }

  private reportTracker(data: any) {
    console.log("监听", data);

    const params = { ...this.data, ...data, time: new Date().getTime() };
    const header = {
      type: "application/x-www-form-urlencoded",
    };
    const blob = new Blob([JSON.stringify(params)], header);
    navigator.sendBeacon(this.data.requestUrl, blob);
  }
}
