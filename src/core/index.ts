import { DefaultOptions, Options, TrackerConfig } from "../type/index";
import { initHistoryEvent } from "../utils/index";
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
      this.captureEvents(
        ["pushState", "popState", "replaceState"],
        "history-pv"
      );
    }
    if (this.data.hashTracker) {
      this.captureEvents(["hashchange"], "hash-pv");
    }
  }

  private captureEvents(eventList: string[], key: string) {
    eventList.forEach((event) => {
      window.addEventListener(event, () => {
        this.reportTracker({ event, key });
      });
    });
  }

  private reportTracker(data: any) {
    const params = { ...this.data, ...data, time: new Date().getTime() };
    const header = {
      type: "application/x-www-form-urlencoded",
    };
    const blob = new Blob([JSON.stringify(params)], header);
    navigator.sendBeacon(this.data.requestUrl, blob);
  }
}
