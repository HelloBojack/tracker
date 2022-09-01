const createHistoryEvent = <T extends keyof History>(type: T) => {
  const nativeHistory = history[type];
  return function () {
    const historyEvent = new Event(type);
    window.dispatchEvent(historyEvent);
    return nativeHistory.apply(this, arguments);
  };
};

export const initHistoryEvent = () => {
  window.history["pushState"] = createHistoryEvent("pushState");
  window.history["replaceState"] = createHistoryEvent("replaceState");
};
