class TrackingService {
  static sessionStartRef = Date.now();

  static onBackground = () => {
    const now = Date.now();
    const loginTime = this.sessionStartRef;
    const durationSeconds = Math.round((now - loginTime) / 1000);
    return {
      loginTime,
      logoutTime: now,
      durationSeconds,
    };
  };

  static onActive = () => {
    this.sessionStartRef = Date.now();
  };

  static currentSessionDuration() {
    const now = Date.now();
    const loginTime = this.sessionStartRef;
    return Math.round((now - loginTime) / 1000);
  }
}

export default TrackingService;
