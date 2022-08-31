export interface DefaultOptions {
  uuid?: string;
  historyTracker: boolean;
  hashTracker: boolean;
  domTracker: boolean;
  sdkVersion: string | number;
  // extra: Record<string, any> | undefined;
  jsError: boolean;
}

export interface Options extends Partial<DefaultOptions> {
  requestUrl: string;
}

export enum TrackerConfig {
  version = "1.0.0",
}
