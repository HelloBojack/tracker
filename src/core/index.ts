import { DefaultOptions, Options, TrackerConfig } from "../type/index";
export default class Tracker {
  private version: string | undefined;
  public data: Options;

  constructor(options: Options) {
    this.data = { ...this.initDef(), ...options };
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
}
