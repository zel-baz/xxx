
export interface NetworkConnection {
  id: string;
  app: string;
  packageName: string;
  localPort: number;
  remoteIp: string;
  protocol: 'TCP' | 'UDP';
  status: 'ESTABLISHED' | 'LISTENING' | 'CLOSE_WAIT' | 'SYN_SENT';
  bytesSent: number;
  bytesReceived: number;
  timestamp: number;
}

// Added DeviceInfo interface to store system telemetry
export interface DeviceInfo {
  browser: {
    userAgent: string;
    language: string;
    platform: string;
    vendor: string;
    online: boolean;
    cookieEnabled: boolean;
  };
  hardware: {
    cores: number;
    memory: number;
    maxTouchPoints: number;
  };
  screen: {
    width: number;
    height: number;
    pixelRatio: number;
    colorDepth: number;
    orientation: string;
  };
  network: {
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
  battery: {
    level: number;
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
  };
  timezone: string;
  geolocation?: {
    lat: number;
    lng: number;
    accuracy: number;
  };
  graphics: {
    vendor: string;
    renderer: string;
  };
}

// Updated SecurityAnalysis to match the schema used in geminiService.ts
export interface SecurityAnalysis {
  riskScore: number;
  summary: string;
  vulnerabilities: string[];
  recommendations: string[];
}
